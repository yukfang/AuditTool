const proxying = require('./util/http/proxying');
const local_token  = "1380b773552ae8c167ecd659aaf2f054614acf68"

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// st: 2024-12-12
// et: 2024-12-12
async function createChangeLogTask(advertiserId,st,et, campaign_ids, adgroup_ids){
    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/changelog/task/create/`;
    const method      = 'POST';
    let header      = {
        "Access-Token" : local_token,
        "Content-Type" : "application/json"
    }
    let param       = { }; 
    let body        = {
        advertiser_id: advertiserId,
        start_time:  st + " 00:00:00",
        end_time:    et + " 00:00:00",
        // module: "STATUS",
    }
    if(campaign_ids !== null) {
        body.object_type = "CAMPAIGN"
        body.object_ids = campaign_ids
    } else if(adgroup_ids !== null) {
        body.object_type = "ADGROUP"
        body.object_ids = adgroup_ids
    }


    const response = (await proxying(method, endpoint, header, param, body, true));
    if(response.status == 200 ) {
        // console.log(response.data)
        const data = JSON.parse(response.data).data;
        return data.task_id

    } else {
        console.log(`Error Creating Changelog task...`)
        return null;
    }
}


async function checkChangeLogTask(advertiserId,taskId){
    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/changelog/task/check/`;
    const method      = 'GET';
    let header      = {
        "Access-Token" : process.env.MAPI_TOKEN || local_token
    }
    let param       = {
        advertiser_id: advertiserId,
        task_id: taskId
     }; 
    let body        = {

    }
    const response = (await proxying(method, endpoint, header, param, body, true))
    // console.log(response)
    if(response.status == 200 ) {

        const data = JSON.parse(response.data).data;
        // console.log(data)

        return data.status

    } else {
        console.log(`Error Checking Changelog task...`)
        return null;
    }
}

async function downloadChangeLogTask(advertiserId,taskId){
    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/changelog/task/download/`;
    const method      = 'GET';
    let header      = {
        "Access-Token" : process.env.MAPI_TOKEN || local_token
    }
    let param       = {
        advertiser_id: advertiserId,
        task_id: taskId
     }; 
    let body        = {

    }
    const response = (await proxying(method, endpoint, header, param, body, true))

    // console.log(response)
    if(response.status == 200 ) {
        const data = JSON.parse(response.data).data;
        var changelog = data.changelog
        return changelog
    } else {
        console.log(`Error Checking Changelog task...`)
        return null;
    }
}

function parseChangeLog(data) {
    const index_of_begin = data.indexOf("{'file_data': b'") + "{'file_data': b'".length
    const index_of_end   = data.indexOf("file_name")
    data = data.substring(index_of_begin,   index_of_end - 3)
    .replaceAll('b\\\'', '')
    .replaceAll('\\\'"', '"')
    .replaceAll('\\r', '').replaceAll('\\r', '').replaceAll('\\r', '').replaceAll('\\r', '').replaceAll('\\r', '')
    .replaceAll('\\n', ';').replaceAll('\\n', ';').replaceAll('\\n', ';').replaceAll('\\n', ';').replaceAll('\\n', ';')
    .replaceAll(';;', ';').replaceAll(';;', ';').replaceAll(';;', ';').replaceAll(';;', ';').replaceAll(';;', ';')
    .replaceAll('""', '"').replaceAll('""', '"').replaceAll('""', '"').replaceAll('""', '"').replaceAll('""', '"')

    .replaceAll('file_data\': b', 'file_data\': ')
    .replaceAll('b\\\'Enabled\\\'', 'Enabled')
    .replaceAll('b\\\'Paused\\\'', 'Paused')
    .replaceAll('b\\\'Approved\\\'', 'Approved')
    .replaceAll('b\\\'In review\\\'', 'In review')
    .replaceAll('b\\\'New campaign\\\'', 'New campaign')
    .replaceAll('b\\\'Edited for review\\\'', 'Edited for review')
    .replaceAll('\\u0026', '&')
    .replaceAll('\\"\\"', '"')
    .replaceAll('\\"', '"')
    .replaceAll('b\'Enabled\'', 'Enabled')
    .replaceAll('b\'Paused\'', 'Paused')

    console.log(`---`)
    console.log(data)



    // Split the data string into summary and records part
    const splitIndex = data.indexOf("Time,log_object_type,Object ID,Object,Operator,Source,App ID,Activity details");
    const summaryData = data.substring(0, splitIndex).trim();
    const recordsData = data.substring(splitIndex).trim();

    // Extract summary of changes (e.g., Budget changes: 2, Bid changes: 0)
    const summary = {};
    const summaryPattern = /([A-Za-z\s]+),(\d+)/g;
    let match;

    // Find all the change types and their counts (e.g., Budget changes, 2)
    while ((match = summaryPattern.exec(summaryData)) !== null) {
        const changeType = match[1].trim();
        const count = parseInt(match[2]);
        summary[changeType] = count;
    }

    // Now, parse the records part, which is separated by semicolons
    const records = [];
    const rows = recordsData.split(';');

    // Skip the title line (first row)
    rows.shift();

    // Iterate over the rows and parse the records
    for (let row of rows) {
        // First, remove unnecessary spaces and then split by comma
        const columns = row.trim().split(',');

        if (columns.length < 8) continue; // Skip if columns are not enough to form a valid record

        // Separate the activityDetails (last column) from the rest
        const time = columns[0].trim();  // Extract time
        const logObjectType = columns[1];
        const objectId = columns[2];
        const objectName = columns[3];
        const operator = columns[4];
        const source = columns[5];
        const appId = columns[6];
        const activityDetailsStr = columns.slice(7).join(',');  // Join the rest as the activityDetails

        // Extract activity details as a string description
        let activityDetails = '';
        if (activityDetailsStr) {
            activityDetails = extractActivityDetails(activityDetailsStr, time); // Pass time to extractActivityDetails
        }

        // Add the parsed record to the records array
        records.push({
            time: time,
            logObjectType: logObjectType,
            objectId: 'T'+objectId,
            objectName: objectName,
            operator: operator,
            source: source,
            appId: appId,
            activityDetails: activityDetails
        });
    }

    // Return the parsed summary and records
    return {
        summary: summary,
        records: records
    };
}



function extractActivityDetails(activityDetailsStr, time) {
    let activityDetails = '';

    // Remove potential escaped quotes (\") in the string
    const cleanedStr = activityDetailsStr.replace(/\\"/g, '"');

    // Match patterns for both Change and Create actions
    const regex = /\"action\":\s*\"(.*?)\",\s*\"name\":\s*\"(.*?)\"(?:,\s*\"before_after\":\s*\[\{.*?\"before\":\s*\"(.*?)\".*?\"after\":\s*\"(.*?)\"\}])?/g;
    let match;

    // Handle Change and Create actions
    while ((match = regex.exec(cleanedStr)) !== null) {
        const action = match[1].trim();  // "Change" or "Create"
        const name = match[2].trim();    // "Budget" or "Ad group"
        const before = match[3]?.trim() || "";  // "200.00 USD" or ""
        const after = match[4]?.trim() || "";   // "100.00 USD" or ""

        let description = "";

        if (action === "Change") {
            description = `${name} changed`;
            if (before) {
                description += ` from ${before}`;
            }
            if (after) {
                description += ` to ${after}`;
            }
        } else if (action === "Create") {
            description = `Create ${name}`;
        }

        // Append time to the description
        activityDetails += `${time}: ${description}\n`;
    }

    return activityDetails.trim();
}






async function getChangeSummary(advertiser_id, st, et,  campaign_id, adgroup_id) {
    /** Create Change Log Task */
    const task_id = await createChangeLogTask(advertiser_id, st, et, null, adgroup_id) 

    /** Check Task Status Till Success */
    var task_status = 'UNKNOWN'
    var count = 0
    while(task_status !== 'SUCCESS' && count < 15) {
        await delay(1000 * 3)
        task_status =  await checkChangeLogTask(advertiser_id, task_id)
        count++
        console.log(`delay ${count}`)
    }
    
    /** Download Task data */
    if(task_status === 'SUCCESS') {
        console.log(`Downloading Change Log...`)
        const changelog = await downloadChangeLogTask(advertiser_id, task_id)
        console.log(changelog)

        const changeSummary = parseChangeLog(changelog);

        console.log("Summary of Changes:", changeSummary.summary);
        console.log("Records:", changeSummary.records);
        return changeSummary
    } else {
        return {
            summary:{}, records:{}
        }
    }
}

async function test() {
    const clients = [
        // {name: 'ABC', adv_id: '7247904300519735298', st: '2025-03-10', et: '2025-03-30', campaign_ids: ['1825944580545570',	'1825944503811122',	'1825944659398705'], adgroup_ids: null},
        // {name: 'LeadS+', adv_id:'7284876975511060482', st:'2025-03-10',et:'2025-03-30', campaign_ids:['1827379790488610','1827381716523057'], adgroup_ids:null},
        {name:'MyGames',     adv_id:'7247904300519735298',    st:'2025-03-10',et:'2025-03-18',campaign_ids:[     '1825944580545570',	'1825944503811122',	'1825944659398705' ],adgroup_ids:null},
        {name:'神曲',         adv_id:'7447094728908374033',    st:'2025-03-13',et:'2025-03-21',campaign_ids:[    '1826461112047617',	'1826461409574001',	'1826462075053201'  ],adgroup_ids:null},
        {name:'Royal Ark',   adv_id:'7323171347171999745',     st:'2025-03-17',et:'2025-03-25',campaign_ids:[     '1826841666142241',	'1826840473418786',	'1826839884892274'  ],adgroup_ids:null},
        {name:'8 Ball Pool', adv_id:'6902039705945112577',     st:'2025-03-17',et:'2025-03-25',campaign_ids:[     '1825212479048801',	'1825591825235058',	'1825213920739362'   ],adgroup_ids:null},
        {name:'Oreon Studios', adv_id:'7156484743041712130',   st:'2025-03-17',et:'2025-03-25',campaign_ids:[   '1825763443731474',	'1825925864656913',	'1825763719056529'   ],adgroup_ids:null},
        {name:'Kefir Games',   adv_id:'7195131247016951810',   st:'2025-03-17',et:'2025-03-25',campaign_ids:[   '1825930908448882',	'1826826951398561',	'1825932109184017'   ],adgroup_ids:null},
        {name:'New Boom AIV',  adv_id:'7364292474195476497',   st:'2025-03-18',et:'2025-03-26',campaign_ids:[   '1825686876660770',	'1825686932416530',	'1825677756280977'   ],adgroup_ids:null},
        {name:'Dynasty Legends', adv_id:'7454444917990146049', st:'2025-03-10',et:'2025-03-26',campaign_ids:[ '1826831629454354',	'1826832167650321',	'1826832996372514'   ] ,adgroup_ids:null},
        {name:'Azur Games',      adv_id:'7366187759830171649', st:'2025-03-10',et:'2025-03-26',campaign_ids:[ '1826392760377425',	'1826391937920002',	'1826390989588497'   ],adgroup_ids:null},
        {name:'上海疾创',         adv_id:'7262225549970374657', st:'2025-03-19',et:'2025-03-27',campaign_ids:['1826282680625185',	'1826282341197873',	'1826281629110370'      ],adgroup_ids:null},
    ]

    for(const client of clients) {
        console.log(`----`)
        console.log(`Processing ${client.name}`)
        const changeSummary = await getChangeSummary(client.adv_id, client.st, client.et, client.campaign_ids, null)

        console.table(changeSummary.records)
        console.log(changeSummary.summary)
    
        // save to csv file
        const fs = require('fs');
        const jsonData = JSON.stringify(changeSummary.records);
        
        // Create CSV content
        let csvContent = "Summary of Changes\n";
        for (const [key, value] of Object.entries(changeSummary.summary)) {
            csvContent += `${key},${value}\n`;
        }
        
        csvContent += "\nRecords\n";
        csvContent += "Time,Object Type,Object ID,Object Name,Operator,Source,App ID,Activity Details\n";
        changeSummary.records.forEach(record => {
            csvContent += `${record.time},${record.logObjectType},${record.objectId},${record.objectName},${record.operator},${record.source},${record.appId},"${record.activityDetails.replace(/\n/g, '; ')}"\n`;
        });
        
        // Write to file
        fs.writeFileSync(`changelog_${client.name}.csv`, csvContent);
        console.log(`Change summary of ${client.name} saved to change_summary.csv`);
    }
}


test()