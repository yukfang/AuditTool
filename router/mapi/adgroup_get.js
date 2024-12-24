const proxying = require('../../util/http/proxying');
const token = require('./token')



module.exports = 
async function mapi_adgroup_get(advertiser_id, filtering){
    console.log(`${arguments.callee.name} advertiser_id = ${advertiser_id}, filtering = ${JSON.stringify(filtering)}`)

    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/adgroup/get/`;
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
        const adgroup_data = data.list[0]
        // console.log(adgroup_data)
        return adgroup_data

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