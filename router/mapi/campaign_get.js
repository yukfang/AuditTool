const proxying = require('../../util/http/proxying');
const token = require('./token')


module.exports = 
async function mapi_campaign_get(advertiser_id, filtering){
    console.log(`${arguments.callee.name} advertiser_id = ${advertiser_id}, filtering = ${filtering}`)

    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/campaign/get/`;
    const method      = 'GET';
    let header      = {
        "Access-Token" : process.env.MAPI_TOKEN || (await token())
    }
    let param       = { };
    let body        = {
        advertiser_id, 
        filtering 
    }

    const response = (await proxying(method, endpoint, header, param, body, true));
    // console.log(response)

    if(response.status == 200 ) {
        const data = JSON.parse(response.data).data;
        // console.log(data)
        const campaign_data = data.list[0]

        // console.log(campaign_data)
        return campaign_data
        return  {
            campaign_name                   : campaign_data.campaign_name,
            is_smart_performance_campaign   : campaign_data.is_smart_performance_campaign,
            objective_type                  : campaign_data.objective_type,
            is_advanced_dedicated_campaign  : campaign_data.is_advanced_dedicated_campaign,
            modify_time                     : campaign_data.is_advanced_dedicated_campaign
        }

    } else {
        console.log(`Get Campaign ${campaign_ids} Detail Error !!!`)
        return null;
    }
}

async function test() {
    const spc_data = await mapi_campaign_get('6800142656270761989', ['1812917564817409'])
    console.log(spc_data)
}

// test();