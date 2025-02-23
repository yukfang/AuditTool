const proxying = require('../../util/http/proxying');
const getAdGroupData = require('../mapi/adgroup_get');
const { Parser } = require("json2csv");
const fs = require("fs");
const delayms = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}



const endpoint_template = 'https://ads.tiktok.com/api/v4/i18n/statistics/adgroup/list/?aadvid=PLACEHOLDER_ADV_ID&scene=campaign_list_v2' 
const header_template = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en,zh-CN;q=0.9,zh-TW;q=0.8,zh;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-csrftoken": "jEbzJPSP5rUoGyIhyw2XpNiuLJ8NG57I",
    'cookie': `csrftoken=jEbzJPSP5rUoGyIhyw2XpNiuLJ8NG57I; i18next=en; s_v_web_id=verify_m2b4d5cb_FtJLZJkp_4kE7_4a7v_82lW_E8WKPm2Unsbg; i18n_redirected=en; tta_attr_id_mirror=0.1730101809.7430730688619347985; _ga=GA1.1.762255633.1730101814; FPID=FPID2.2.p%2FshhIqFEPLJCK3%2FFeACJr7VG2TIXjSVr%2FzBdAmBEbg%3D.1730101814; FPAU=1.2.223160141.1730101815; tta_attr_id=0.1730101844.7430730839740399623; lang_type_ttp=en; _gcl_au=1.1.1520697478.1730871869; _tt_enable_cookie=1; tt_csrf_token=Dg68WYmn-phHs2iaJYqSXQsgSOLhAdx-MNQs; tt_chain_token=7Q6nlr1KV0JnRoVRXyFWmw==; sso_uid_tt_ads=0578c2a9d49e65d1f2b55d9e7c2fbf4c13749c9a01f57db192ef3c21f3c2b26b; sso_uid_tt_ss_ads=0578c2a9d49e65d1f2b55d9e7c2fbf4c13749c9a01f57db192ef3c21f3c2b26b; sso_user_ads=c42b7314b6a3da2504694429317935a1; sso_user_ss_ads=c42b7314b6a3da2504694429317935a1; _ga_ER02CH5NW5=GS1.1.1735098786.3.0.1735098806.0.0.1099875177; lng_type=en; passport_csrf_token=7d5dd2e1b94daa56a9c2291b6e607588; passport_csrf_token_default=7d5dd2e1b94daa56a9c2291b6e607588; _euk=tt_mve2rwxYLIK8WmU5v--58PA-; _fbp=fb.1.1735646327231.1013513059; sid_ucp_sso_v1_ads=1.0.0-KGM2NWIxNjFiZjQ0MDUzMjc3YjgzMDkzZTM5NzMyNDBjMDAzMmYwZmIKFwiCiNuUuYCcyV8Qpez4uwYYrww4CEA0EAMaA3NnMSIgYzQyYjczMTRiNmEzZGEyNTA0Njk0NDI5MzE3OTM1YTE; ssid_ucp_sso_v1_ads=1.0.0-KGM2NWIxNjFiZjQ0MDUzMjc3YjgzMDkzZTM5NzMyNDBjMDAzMmYwZmIKFwiCiNuUuYCcyV8Qpez4uwYYrww4CEA0EAMaA3NnMSIgYzQyYjczMTRiNmEzZGEyNTA0Njk0NDI5MzE3OTM1YTE; x-creative-csrf-token=dlLUj14G-PYunYXzHT8OcmicIjtsfFUghLQw; _ttp=2rQ9oNRyW1ad27YpmLajAAGuEKe.tt.1; d_ticket_ads=8e81079075ebe82bd1284c344eef302e241eb; _ga_QQM0HPKD40=GS1.1.1736768106.1.1.1736768150.0.0.1783763034; sid_guard_ads=dde2c4bb22f05fba170cc681cc3dce8b%7C1736915740%7C2432905%7CWed%2C+12-Feb-2025+08%3A24%3A05+GMT; uid_tt_ads=c0ccc1a7c4b81425ae2f497c744e3bccabe4e609b8e1c3bd03269ef47d45f8e1; uid_tt_ss_ads=c0ccc1a7c4b81425ae2f497c744e3bccabe4e609b8e1c3bd03269ef47d45f8e1; sid_tt_ads=dde2c4bb22f05fba170cc681cc3dce8b; sessionid_ads=dde2c4bb22f05fba170cc681cc3dce8b; sessionid_ss_ads=dde2c4bb22f05fba170cc681cc3dce8b; sid_ucp_v1_ads=1.0.0-KGU3NDZjNzc0N2U5ZWFmNjk1MmQwYmZmMjdkNDY4NDY3YTE3ODVhZDQKGQiCiNuUuYCcyV8QnPacvAYYrwwgDDgIQDQQAxoCbXkiIGRkZTJjNGJiMjJmMDVmYmExNzBjYzY4MWNjM2RjZThi; ssid_ucp_v1_ads=1.0.0-KGU3NDZjNzc0N2U5ZWFmNjk1MmQwYmZmMjdkNDY4NDY3YTE3ODVhZDQKGQiCiNuUuYCcyV8QnPacvAYYrwwgDDgIQDQQAxoCbXkiIGRkZTJjNGJiMjJmMDVmYmExNzBjYzY4MWNjM2RjZThi; _tea_utm_cache_1583={%22campaign_id%22:1820237368241201%2C%22creative_id%22:1820679651703826}; _tea_utm_cache_4697={%22campaign_id%22:1820237368241201%2C%22creative_id%22:1820679651703826}; msToken=Fu-8p2f-le85uO_rfFr0NIfBYEozxWOLxwmzVgOGTQC5Q6FaypHIx1he5bSXD6-6c0SIP6HG4UviSsnS8GGLdEENEZztsEF91vulUZbWr7ISk3xDZfW-4_Lee6JFD1arlAiC37U=; _ga_HV1FL86553=GS1.1.1737082822.38.0.1737082852.0.0.1655799655; _ga_Y2RSHPPW88=GS1.1.1737082822.35.0.1737082852.0.0.1132779097; msToken=HR3odDzOUaO-aBTzXrvH_yC3I67Fo3153o_Lm1-furMFKG7oWXDgSLSHVFnifdINnogUyNrvUHRV3Cl2lGpVret8W2bmrbHKE09AvK02QuY7TlDsZQjEMpMIsBT9; odin_tt=0fdfea9751cbb7399ee87aaf41fea8f5782eeaa6adf1d839c754da27cbc6707007ff53a2d8324044995483ef8fb3c5bb; ks_theme=1; lang_type=en; pre_country=US; part=stable; pre_country=US; ttwid=1%7C90SBFHRG4A2tbADQWjAQPyp39sPRsmc_J4JZDCnUDQA%7C1737380327%7Cd839b844829815f6079e840d73eb3c739a395ebb0c891be5e3fffa349e06e0a6`,
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
const body_template = '{"version":2,"sort_stat":"create_time","sort_order":1,"page":1,"limit":20,"st":"PLACEHOLDER_ST","et":"PLACEHOLDER_ET","query_list":["attribution_window","stat_cost","cpc","cpm","show_cnt","click_cnt","ctr","time_attr_convert_cnt","time_attr_conversion_cost","time_attr_conversion_rate_imp","time_attr_effect_cnt","time_attr_effect_cost","time_attr_effect_rate", "show_uv","frequency",      "time_attr_web_landing_page_view", "time_attr_cost_per_web_landing_page_view","time_attr_web_landing_page_view_per_click","time_attr_on_web_cart","time_attr_shopping","time_attr_total_shopping_value","time_attr_shopping_roas",       "time_attr_engagement_session","time_attr_cost_per_engagement_session","time_attr_engagement_session_per_click","bid_strategy_value"],"lifetime":0,"relative_time":4,"compare_st":"","compare_et":"","keyword":"","search_type":1,"selection_filter":"","campaign_status":[],"ad_status":["no_delete"],"opt_status":[],"creative_status":[],"objective_type_filter":[],"pricing":[],"placement_id":[],"image_mode":[],"item_source":[],"smart_creative_material_mode":[],"campaign_abtest":[],"having_filter":[],"country":[],"province":[],"city":[],"particle_locations":[],"bid_strategy":[],"age":[],"gender":[],"dedicate_type_profile_page_type":[],                                    "selection_ids":{"ad_ids":[],"campaign_ids":[],"creative_ids":[]},"dpa_local_audience":[],"optimize_goal_filter":[],"promotion_type":[],"flow_control_mode":[],"cpa_delivery_mode":[],"ad_entity_type":[],"creative_material_mode":[],"campaign_category":[],"budget_optimizer_switch":[],"app_campaign_type":[],"universal_type":[],"destination":[],"ecomm_type":[],"creative_campaign_type":[],"campaign_system_origin":[],"label_ids":[],"statistics_buying_type":[],"sales_catalog_on":[],"sales_destination":[],"creative_disclose_auction_roi2_type":[],"filters":[{"field":"ad_ids","in_field_values":["PLACEHOLDER_AD_GROUP_ID"],"filter_type":0},{"field":"ad_status","filter_type":0,"in_field_values":["no_delete"]}],"get_compare_value":false,"get_compare_rate":false,"get_compare_diff":false,"is_attr_required":0,"extra":{"scene":"campaign_list_v2","list_version":"v2","page_view_scene":"view_non_first","region_schedule":"1","ab_primary_status":"v2"}}'

  
    // 'cookie': 'csrftoken=jEbzJPSP5rUoGyIhyw2XpNiuLJ8NG57I; part=stable; sid_tt_ads=d0fd9ae4104afd4a292088a3336f728c; sessionid_ads=d0fd9ae4104afd4a292088a3336f728c; sessionid_ss_ads=d0fd9ae4104afd4a292088a3336f728c;   msToken=nPayfCr0eTzx13azjmX0Pvtd2UD2RvA1JmWC3TOocSYPtZAsbI6C2eTPBAW9dFC5IxDGD_lVOROAO4i1yKqDMPBsuLajgQ_O-evbyyL5IadV1ciHnIxiYno82pvDI8WXeWAOKzfx;',


async function  getTTAMMetric(adv_id, adgroup_id,st,et) {
    const endpoint  = endpoint_template.replaceAll('PLACEHOLDER_ADV_ID', adv_id)
    const method    = 'POST';
    let header      = header_template
    let param       = { }; 
    let body        = body_template.replaceAll('PLACEHOLDER_AD_GROUP_ID', adgroup_id).replaceAll('PLACEHOLDER_ST', st).replaceAll('PLACEHOLDER_ET', et)

    const response = (await proxying(method, endpoint, header, param, body, true));
    // console.log(response)
    if(response.status === 200) {
        const data = JSON.parse(response.data).data
        /** Validate Pagination, should be all 1 */
        if(data.pagination.total_count !== 1 || data.pagination.page_count !== 1 || data.pagination.page !== 1 ) {
            console.log(`Pagination Error!!!`)
            return {}
        }

        /** Statistics */
        const statistics = data.statistics

        /** Monitored Metrics */
        const kpi = {
            'cost($USD)'    : parseFloat(statistics.stat_cost),
            impression      : parseInt(statistics.show_cnt),
            cpm             : parseFloat(statistics.cpm),
            click           : parseInt(statistics.click_cnt),
            'ctr(%)'        : parseFloat(statistics.ctr),
            cpc             : parseFloat(statistics.cpc),

            reach          : parseInt(statistics.show_uv),
            frequency      : parseFloat(statistics.frequency),

            lpv             : parseInt(statistics.time_attr_web_landing_page_view),
            cplpv           : parseFloat(statistics.time_attr_cost_per_web_landing_page_view),
            'lpv_rate(%)'   : parseFloat(statistics.time_attr_web_landing_page_view_per_click),

            dlpv            : parseInt(statistics.time_attr_engagement_session),
            cpdlpv          : parseFloat(statistics.time_attr_cost_per_engagement_session),
            'dlpv_rate(%)'  : parseFloat(statistics.time_attr_engagement_session_per_click),


            atc             : parseInt(statistics.time_attr_on_web_cart),
            cp              : parseInt(statistics.time_attr_shopping),
            cp_value        : parseFloat(statistics.time_attr_total_shopping_value),
            cp_roas         : parseFloat(statistics.time_attr_shopping_roas)

        }

        // console.log(statistics)
        // console.log(kpi)
        return kpi

    } else {
        console.log(`Status not 200`)
    }
}


const TestClients = [

/** Ebay */ 
{ client_name: 'Ebay', adv_id: '7140346782873075713', adgroup_id: '1817462395527201', ea: 'LPV',        cat: "TEST",    st: '2024-12-01', et: '2024-12-31', location_ids:[], os:[] },
{ client_name: 'Ebay', adv_id: '7140346782873075713', adgroup_id: '1817462391068674', ea: 'Clicks',     cat: "TEST",    st: '2024-12-01', et: '2024-12-31', location_ids:[], os:[] },


/** Google */
// { client_name: 'Google', adv_id: '7295828129405304834', adgroup_id: '1813087034872849', ea: 'Clicks',  cat: "TEST",    st: '2024-12-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Google', adv_id: '7295828129405304834', adgroup_id: '1813088595347521', ea: 'Clicks',  cat: "TEST",    st: '2024-12-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Google', adv_id: '7295828129405304834', adgroup_id: '1818639510137889', ea: 'LPV',     cat: "TEST",    st: '2024-12-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Google', adv_id: '7295828129405304834', adgroup_id: '1818639913073666', ea: 'LPV',     cat: "TEST",    st: '2024-12-01', et: '2025-02-10', location_ids:[], os:[] },


/** Edmunds */
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1785383570051105', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1816367721120785', ea: 'DLPV',    cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1816366087863313', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1816367328257025', ea: 'DLPV',    cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1822187575457905', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1822546688739330', ea: 'DLPV',    cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1822730357218306', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Edmunds', adv_id: '7016021727943639042', adgroup_id: '1821984326959106', ea: 'DLPV',    cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },


/** Glossier */
// { client_name: 'Glossier', adv_id: '6883603160959549442', adgroup_id: '1819431600654354', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Glossier', adv_id: '6883603160959549442', adgroup_id: '1814991091529762', ea: 'LPV',    cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Glossier', adv_id: '6883603160959549442', adgroup_id: '1819431537320994', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },
// { client_name: 'Glossier', adv_id: '6883603160959549442', adgroup_id: '1799432665953282', ea: 'LPV',    cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:[], os:[] },

// /** Apple */
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818808332132450', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["Both"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818808669658146', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["iOS"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818805487235105', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["iOS"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818805487181825', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["iOS"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818805487242273', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["And"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818809001088033', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["And"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818804820334641', ea: 'DLPV',   cat: "TEST",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["And"] },

// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818993785795698', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["Both"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818733712251106', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["iOS"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818733556978705', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["iOS"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1818993796140034', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["iOS"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1820728495083553', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["And"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1820728492583986', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["And"] },
// { client_name: 'Apple', adv_id: '6961908603947089922', adgroup_id: '1820639523627009', ea: 'LPV',   cat: "CTRL",    st: '2025-01-01', et: '2025-02-10', location_ids:["6252001"], os:["And"] },



].concat(
    // TestClientsOld
)
  
async function getAdGroupMetrics(params) {
    const client_name   = params.client_name
    const adv_id        = params.adv_id
    const adgroup_id    = params.adgroup_id
    const ea            = params.ea  
    const cat           = params.cat
    const today         = new Date().toISOString().split('T')[0]
    const yesterday     =  dateMinus(today, 1)
    const st            = params.st
    const et            = params.et === '' ? today : params.et


    const metrics = []

    /** 1. Life Time */
    {
        const adGroupData = await getAdGroupData(adv_id, {adgroup_ids : [adgroup_id]})
        console.log(`ad_group : ${adgroup_id} location_ids : ${adGroupData.location_ids} os : ${adGroupData.operating_systems}`)
        const metric = await getTTAMMetric(adv_id, adgroup_id, st, et)
        metrics.push({
            client_name,
            adv_id      : 'ADV'         + adv_id,
            adgroup_id  : cat + adgroup_id,
            location_ids: adGroupData.location_ids,
            os: adGroupData.operating_systems,
            ea, cat,
            date        : "LifeTime", 
            ...metric
        })
    }

    /** 3. Daily */
    // for(let i = st; i != et && i != datePlus(today, 1); i = datePlus(i, 1)) {
    //     const metric = await getTTAMMetric(adv_id, adgroup_id, i, i)
    //     metrics.push({
    //         client_name,
    //         adv_id      : 'ADV'         + adv_id,
    //         adgroup_id  : cat + adgroup_id,
    //         ea, cat,
    //         date        : 'D' + i,
    //         ...metric
    //     })
    //     await delayms(100)
    // }


    console.table(metrics, ['date', 'client_name',  'adgroup_id', 'ea', 'cat', 'cost($USD)', 'impression', 'lpv', 'cplpv',  'dlpv', 'cpdlpv',  'atc', 'cp'])
    return metrics
}

async function getAllMetrics() {
    let metrics = []

    for(let i = 0; i < TestClients.length; i++) {
        const client = TestClients[i]
        const data = await getAdGroupMetrics(client)
        metrics = metrics.concat(data)
    }

    console.table(metrics, ['date', 'client_name',  'adgroup_id', 'ea', 'cat', 'cost($USD)', 'impression', 'lpv', 'cplpv',  'dlpv', 'cpdlpv', 'atc', 'cp'])

    // Write to FIle
    const MMDD   = new Date().toISOString().split('T')[0].replaceAll('-', '').substring(4)
    const HHMMSS = new Date().toISOString().split('T')[1].split('.')[0].replaceAll(':', '')
    writeToCsv(metrics, `${MMDD}_${HHMMSS}_raw_data.csv`)

}

// getAdGroupMetrics(TestClients[1])
getAllMetrics()


function datePlus(datestr, days) {
    const date = new Date(datestr)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
}
function dateMinus(datestr, days) {
    const date = new Date(datestr)
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
}
function writeToCsv(jsonArray, outputFile, fields = null) {
    try {
        // If fields are not provided, detect them automatically
        const opts = fields ? { fields } : {};

        // Initialize the parser
        const parser = new Parser(opts);

        // Convert JSON array to CSV
        const csv = parser.parse(jsonArray);

        // Write the CSV data to the specified file
        fs.writeFileSync(outputFile, csv);

        console.log(`Successfully wrote data to ${outputFile}`);
    } catch (err) {
        console.error("Error converting JSON to CSV:", err);
    }
}