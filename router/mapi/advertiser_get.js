const proxying = require('../../util/http/proxying');
const token = require('./token')


async function mapi_adv_info_get(advertiser_id){
    console.log(`${arguments.callee.name} advertiser_id = ${advertiser_id} `)

    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/advertiser/info/`;
    const method      = 'GET';
    let header      = {
        // "Access-Token" : process.env.MAPI_TOKEN || (await token())
        "Access-Token" : process.env.MAPI_TOKEN || "1380b773552ae8c167ecd659aaf2f054614acf68"
    }
    let param       = { };
    let body        = {
        advertiser_ids : [advertiser_id]
    }

    const response = (await proxying(method, endpoint, header, param, body, true));
    // console.log(response)

    if(response.status == 200 ) {
        const data = JSON.parse(response.data).data.list[0];
        console.log(data)
        return data
    } else {
        console.log(`Get Adv Info ${advertiser_id} Detail Error !!!`)
        return null;
    }
}

async function test() {
    const adv_data = await mapi_adv_info_get('7160307630588674049', [])
    console.log(adv_data)
}

test();

module.exports = mapi_adv_info_get;
