const proxying = require('../../util/http/proxying');
const token = require('./token')
const local_token  = "1380b773552ae8c167ecd659aaf2f054614acf68"

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function createChangeLogTask(advertiserId, campaign_id, adgroup_id){
    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/changelog/task/create/`;
    const method      = 'POST';
    let header      = {
        "Access-Token" : process.env.MAPI_TOKEN || local_token,
        "Content-Type" : "application/json"
    }
    let param       = { }; 
    let body        = {
        advertiser_id: advertiserId,
        start_time:  "2024-12-12 00:00:00",
        end_time:  "2025-01-11 00:00:00",
        // module: "STATUS",
    }
    if(campaign_id !== null) {
        body.object_type = "CAMPAIGN"
        body.object_ids = [campaign_id]
    } else if(adgroup_id !== null) {
        body.object_type = "ADGROUP"
        body.object_ids = [adgroup_id]
    }


    const response = (await proxying(method, endpoint, header, param, body, true));
    if(response.status == 200 ) {

        const data = JSON.parse(response.data).data;
        console.log(data)

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
    console.log(response)
    if(response.status == 200 ) {

        const data = JSON.parse(response.data).data;
        console.log(data)

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

    console.log(response)
    if(response.status == 200 ) {

        const data = JSON.parse(response.data).data;
        var changelog = data.changelog
        const index_of_begin = changelog.indexOf("{'file_data': b'") + "{'file_data': b'".length
        const index_of_end   = changelog.indexOf("', 'file_name':")
        changelog = changelog.substring(index_of_begin,   index_of_end + 0)

        // Hardcode for quick 
        changelog = changelog
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
        // console.log(changelog)

        return changelog

    } else {
        console.log(`Error Checking Changelog task...`)
        return null;
    }
}

function parseChangeLog(data) {
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
            objectId: objectId,
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






async function getChangeSummary(advertiser_id, adgroup_id) {
    // const advertiser_id = '6895988885369683969'
    // const adgroup_id = '1818953250149409'
    const task_id = await createChangeLogTask(advertiser_id, null, adgroup_id) 

    var task_status = 'UNKNOWN'
    var count = 0
    while(task_status !== 'SUCCESS' && count < 10) {
        await delay(1000 * 3)
        task_status =  await checkChangeLogTask(advertiser_id, task_id)
        count++
        console.log(`delay ${count}`)
    }
    
    if(task_status === 'SUCCESS') {
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

// test()
module.exports = getChangeSummary
