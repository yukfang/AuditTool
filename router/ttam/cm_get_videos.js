const proxying = require('../../util/http/proxying');
const token = require('./token')

const { Parser } = require("json2csv");
const fs = require("fs");
const delayms = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}



const endpoint_template = 
'https://ads.tiktok.com/api/shopping/v2/catalog/video/?catalog_id=PLACEHOLDER_CATALOG_ID&aadvid=&page_num=1&page_size=500&bc_id=PLACEHOLDER_BC_ID' 

// 'https://ads.tiktok.com/api/shopping/v2/catalog/video/?catalog_id=PLACEHOLDER_CATALOG_ID&aadvid=&page_num=1&page_size=500&bc_id=PLACEHOLDER_BC_ID' 


const header_template = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en,zh-CN;q=0.9,zh-TW;q=0.8,zh;q=0.7',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'cookie': ''
  }

async function  getCMVideoName(catalog_id, bc_id) {
    console.log(`${catalog_id} ${bc_id}`)
    if(catalog_id.length === 1 
        || catalog_id.length !== '7359085704204257041'.length
        || bc_id.length !== '7348650395633238018'.length) {
        console.log(`Invalid Catalog ID ${catalog_id} or BC ID ${bc_id}`)
        return null
    }


    const endpoint  = endpoint_template.replaceAll('PLACEHOLDER_CATALOG_ID', catalog_id)
                                        .replaceAll('PLACEHOLDER_BC_ID', bc_id)         
    const method    = 'GET';
    let header      = header_template
    header.cookie   = await token()
    let param       = {}; 
    let body        = {} // body_template.replaceAll('PLACEHOLDER_AD_GROUP_ID', adgroup_id).replaceAll('PLACEHOLDER_ST', st).replaceAll('PLACEHOLDER_ET', et)

    const response = (await proxying(method, endpoint, header, param, body, true));
    // console.log(response)
    if(response.status === 200) {
        const videoList = JSON.parse(response.data).data.catalog_video_list.map(x => x.name)
        console.log(videoList)
        return videoList

    } else {
        console.log(`Status not 200`)
    }
}


// getCMVideoName('7359085704204257041', '7348650395633238018')

module.exports = getCMVideoName


