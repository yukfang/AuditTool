const proxying = require('../../util/http/proxying');
const token = require('./token')



module.exports = 
async function mapi_campaign_spc_get(advertiser_id, campaign_ids){
    const endpoint = `https://business-api.tiktok.com/open_api/v1.3/campaign/spc/get/`;
    const method      = 'GET';
    let header      = {
        "Access-Token" : process.env.MAPI_TOKEN || (await token())
    }
    let param       = { };
    let body        = {
        advertiser_id, campaign_ids
    }

    const response = (await proxying(method, endpoint, header, param, body, true));
    // console.log(response.data)

    if(response.status == 200 ) {
        const data = JSON.parse(response.data).data;
        const campaign_data = data.list[0]
        // console.log(campaign_data)
        return campaign_data

        return  {
            // Campaign Info
            campaign_name       : campaign_data.campaign_name,
            objective_type      : campaign_data.objective_type,
            optimization_goal   : campaign_data.optimization_goal,
            is_advanced_dedicated_campaign : campaign_data.is_advanced_dedicated_campaign,
            is_smart_performance_campaign : campaign_data.is_smart_performance_campaign,
            spc_type            : campaign_data.spc_type,
            spc_audience_age    : campaign_data.spc_audience_age,

            app_name       : campaign_data.app_name,
            app_download_url : campaign_data.app_download_url,
            app_type       : campaign_data.app_type,


            // Bidding
            budget                  : campaign_data.budget,
            conversion_bid_price    : campaign_data.conversion_bid_price,
            billing_event           : campaign_data.billing_event,



            // Attribution
            click_attribution_window            : campaign_data.click_attribution_window,
            view_attribution_window             : campaign_data.view_attribution_window,
            engaged_view_attribution_window     : campaign_data.engaged_view_attribution_window,
            attribution_event_count             : campaign_data.attribution_event_count,


            // Targeting
            placement_type      : campaign_data.placement_type,
            placements          : campaign_data.placements,
            gender              : campaign_data.gender,
            exclude_age_under_eighteen  : campaign_data.exclude_age_under_eighteen,
            location_ids                : campaign_data.location_ids,
            excluded_audience_ids       : campaign_data.excluded_audience_ids,
            operation_status            : campaign_data.operation_status,

            // Creative
            media_info_list : campaign_data.media_info_list.length,

            // Operation 
            modify_time         : campaign_data.modify_time,
            schedule_start_time : campaign_data.schedule_start_time,


        }
    } else {
        console.log(`Get Campaign ${campaign_ids} Detail Error !!!`)
        return null;
    }
}

async function test() {
    const spc_campaign = await mapi_campaign_spc_get('6800142656270761989', ['1812915048062993'])
    console.log(spc_campaign)
}

// test()


