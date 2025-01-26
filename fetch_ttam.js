async function getTTAMData() {
  const result = await fetch("https://ads.tiktok.com/api/v4/i18n/statistics/adgroup/list/?aadvid=7325100941009731586&scene=campaign_list_v2&msToken=s3u8N4aIl5lbeXy4HvzbL4q8F3eFUIBKxTmV0VDChQ9Ln0IG0Z44ElcouneRh3r8FBc6hmAoGKFZVUewSXCgBwe7k7GZdeOZIpdoEV_xDd8csjwpL8OFuYbxZnLPrDoH6-SCvTAS&X-Bogus=DFSzswVLpjMIeM5Tt8tcKt9WcBrW&_signature=_02B4Z6wo00001.jO6DQAAIDD-M7oNZtvd4P4zuyAAJlR5b", {
    "headers": {
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
      "trace-log-user-id": "",
      "x-csrftoken": "jEbzJPSP5rUoGyIhyw2XpNiuLJ8NG57I",
      'cookie': 'csrftoken=jEbzJPSP5rUoGyIhyw2XpNiuLJ8NG57I; part=stable; sid_tt_ads=d0fd9ae4104afd4a292088a3336f728c; sessionid_ads=d0fd9ae4104afd4a292088a3336f728c; sessionid_ss_ads=d0fd9ae4104afd4a292088a3336f728c;   msToken=nPayfCr0eTzx13azjmX0Pvtd2UD2RvA1JmWC3TOocSYPtZAsbI6C2eTPBAW9dFC5IxDGD_lVOROAO4i1yKqDMPBsuLajgQ_O-evbyyL5IadV1ciHnIxiYno82pvDI8WXeWAOKzfx;',
      "Referer": "https://ads.tiktok.com/i18n/manage/adgroup?aadvid=7325100941009731586&columns=campaign_budget%2Cad_id%2Cbudget%2Cbid%2Cschedule%2Cattribution_window%2Cad_name%2Ccreative_id%2Cstat_cost%2Ccpc%2Ccpm%2Cshow_cnt%2Cclick_cnt%2Cctr%2Ctime_attr_convert_cnt%2Ctime_attr_conversion_cost%2Ctime_attr_conversion_rate_imp%2Ctime_attr_effect_cnt%2Ctime_attr_effect_cost%2Ctime_attr_effect_rate%2Ctime_attr_engagement_session%2Ctime_attr_cost_per_engagement_session%2Ctime_attr_engagement_session_per_click&relative_time=4&filters%5B0%5D%5Bfield%5D=ad_ids&filters%5B0%5D%5Bin_field_values%5D%5B0%5D=1817623149104178&filters%5B0%5D%5Bfilter_type%5D=0",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{\"version\":2,\"sort_stat\":\"create_time\",\"sort_order\":1,\"page\":1,\"limit\":20,\"st\":\"2024-12-07\",\"et\":\"2024-12-21\",\"query_list\":[\"attribution_window\",\"stat_cost\",\"cpc\",\"cpm\",\"show_cnt\",\"click_cnt\",\"ctr\",\"time_attr_convert_cnt\",\"time_attr_conversion_cost\",\"time_attr_conversion_rate_imp\",\"time_attr_effect_cnt\",\"time_attr_effect_cost\",\"time_attr_effect_rate\",\"time_attr_engagement_session\",\"time_attr_cost_per_engagement_session\",\"time_attr_engagement_session_per_click\",\"bid_strategy_value\"],\"lifetime\":0,\"relative_time\":4,\"compare_st\":\"\",\"compare_et\":\"\",\"keyword\":\"\",\"search_type\":1,\"selection_filter\":\"\",\"campaign_status\":[],\"ad_status\":[\"no_delete\"],\"opt_status\":[],\"creative_status\":[],\"objective_type_filter\":[],\"pricing\":[],\"placement_id\":[],\"image_mode\":[],\"item_source\":[],\"smart_creative_material_mode\":[],\"campaign_abtest\":[],\"having_filter\":[],\"country\":[],\"province\":[],\"city\":[],\"particle_locations\":[],\"bid_strategy\":[],\"age\":[],\"gender\":[],\"dedicate_type_profile_page_type\":[],\"selection_ids\":{\"ad_ids\":[],\"campaign_ids\":[],\"creative_ids\":[]},\"dpa_local_audience\":[],\"optimize_goal_filter\":[],\"promotion_type\":[],\"flow_control_mode\":[],\"cpa_delivery_mode\":[],\"ad_entity_type\":[],\"creative_material_mode\":[],\"campaign_category\":[],\"budget_optimizer_switch\":[],\"app_campaign_type\":[],\"universal_type\":[],\"destination\":[],\"ecomm_type\":[],\"creative_campaign_type\":[],\"campaign_system_origin\":[],\"label_ids\":[],\"statistics_buying_type\":[],\"sales_catalog_on\":[],\"sales_destination\":[],\"creative_disclose_auction_roi2_type\":[],\"filters\":[{\"field\":\"ad_ids\",\"in_field_values\":[\"1817623149104178\"],\"filter_type\":0},{\"field\":\"ad_status\",\"filter_type\":0,\"in_field_values\":[\"no_delete\"]}],\"get_compare_value\":false,\"get_compare_rate\":false,\"get_compare_diff\":false,\"is_attr_required\":0,\"extra\":{\"scene\":\"campaign_list_v2\",\"list_version\":\"v2\",\"page_view_scene\":\"view_non_first\",\"region_schedule\":\"1\",\"ab_primary_status\":\"v2\"}}",
    "method": "POST"
  });

  console.log(result)
} 

async function test() {
  await getTTAMData()
}

test()

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
  "trace-log-adv-id": "7325100941009731586",
  "trace-log-user-id": "",
  "x-csrftoken": "jEbzJPSP5rUoGyIhyw2XpNiuLJ8NG57I",
  "cookie": "csrftoken=jEbzJPSP5rUoGyIhyw2XpNiuLJ8NG57I; i18next=en; s_v_web_id=verify_m2b4d5cb_FtJLZJkp_4kE7_4a7v_82lW_E8WKPm2Unsbg; i18n_redirected=en; tta_attr_id_mirror=0.1730101809.7430730688619347985; _ga=GA1.1.762255633.1730101814; FPID=FPID2.2.p%2FshhIqFEPLJCK3%2FFeACJr7VG2TIXjSVr%2FzBdAmBEbg%3D.1730101814; FPAU=1.2.223160141.1730101815; tta_attr_id=0.1730101844.7430730839740399623; lang_type_ttp=en; _gcl_au=1.1.1520697478.1730871869; _tt_enable_cookie=1; tt_csrf_token=Dg68WYmn-phHs2iaJYqSXQsgSOLhAdx-MNQs; tt_chain_token=7Q6nlr1KV0JnRoVRXyFWmw==; sso_uid_tt_ads=0578c2a9d49e65d1f2b55d9e7c2fbf4c13749c9a01f57db192ef3c21f3c2b26b; sso_uid_tt_ss_ads=0578c2a9d49e65d1f2b55d9e7c2fbf4c13749c9a01f57db192ef3c21f3c2b26b; sso_user_ads=c42b7314b6a3da2504694429317935a1; sso_user_ss_ads=c42b7314b6a3da2504694429317935a1; sid_ucp_sso_v1_ads=1.0.0-KDk1ZDBkMDM0ZWZhNDg1YTY1YjAyMjQwYWJlNDNhOTQwZTViOGQzYzUKFwiCiNuUuYCcyV8QpsbKugYYrww4CEA0EAMaA215MiIgYzQyYjczMTRiNmEzZGEyNTA0Njk0NDI5MzE3OTM1YTE; ssid_ucp_sso_v1_ads=1.0.0-KDk1ZDBkMDM0ZWZhNDg1YTY1YjAyMjQwYWJlNDNhOTQwZTViOGQzYzUKFwiCiNuUuYCcyV8QpsbKugYYrww4CEA0EAMaA215MiIgYzQyYjczMTRiNmEzZGEyNTA0Njk0NDI5MzE3OTM1YTE; ks_theme=1; _ga_ER02CH5NW5=GS1.1.1735098786.3.0.1735098806.0.0.1099875177; lng_type=en; x-creative-csrf-token=ySR3tYSu-u6qa0kz_V7cNZDye9F5dtYDpMso; lang_type=en; pre_country=SG; passport_csrf_token=7d5dd2e1b94daa56a9c2291b6e607588; passport_csrf_token_default=7d5dd2e1b94daa56a9c2291b6e607588; part=stable; _euk=tt_mve2rwxYLIK8WmU5v--58PA-; _fbp=fb.1.1735646327231.1013513059; uid_tt_ads=28ca41ef239e433b9da42c8a2312e04a6f06a25592de19a3546f5e9c181a17a2; uid_tt_ss_ads=28ca41ef239e433b9da42c8a2312e04a6f06a25592de19a3546f5e9c181a17a2; sid_tt_ads=d0fd9ae4104afd4a292088a3336f728c; sessionid_ads=d0fd9ae4104afd4a292088a3336f728c; sessionid_ss_ads=d0fd9ae4104afd4a292088a3336f728c; sid_ucp_v1_ads=1.0.0-KDgwMjc2OTVkY2Y1MTA1NjJjZDcyYTJhYjE3NDFhNzkxYWQ4ZTA1NGMKGQiCiNuUuYCcyV8Q8P_tuwYYrwwgDDgIQDQQAxoDc2cxIiBkMGZkOWFlNDEwNGFmZDRhMjkyMDg4YTMzMzZmNzI4Yw; ssid_ucp_v1_ads=1.0.0-KDgwMjc2OTVkY2Y1MTA1NjJjZDcyYTJhYjE3NDFhNzkxYWQ4ZTA1NGMKGQiCiNuUuYCcyV8Q8P_tuwYYrwwgDDgIQDQQAxoDc2cxIiBkMGZkOWFlNDEwNGFmZDRhMjkyMDg4YTMzMzZmNzI4Yw; sid_guard_ads=d0fd9ae4104afd4a292088a3336f728c%7C1736146929%7C863999%7CThu%2C+16-Jan-2025+07%3A02%3A08+GMT; pre_country=SG; _tea_utm_cache_1583={%22campaign_id%22:1820221105118226%2C%22creative_id%22:1820221105679377}; _tea_utm_cache_4697={%22campaign_id%22:1820221105118226%2C%22creative_id%22:1820221105679377}; ac_csrftoken=3f5818f3bf0444b383a4bb6e7d25bef7; _ttp=2r6rTXozCEfutUAjZu3Hz3OWkYU.tt.1; FPLC=u25OZK6NC0SRQ5PhzBJn%2BCr9KQWIplm8Cye9bWGNkNpJ0T7zQ%2F7a8utRTPDdtyAMkesDLt1nGsKhjoh6r6VWbA%2BDSLXwaXM%2Bidx84XYcVFmFoFu4PXsJMA4%2Bhp5W%2BA%3D%3D; msToken=s3u8N4aIl5lbeXy4HvzbL4q8F3eFUIBKxTmV0VDChQ9Ln0IG0Z44ElcouneRh3r8FBc6hmAoGKFZVUewSXCgBwe7k7GZdeOZIpdoEV_xDd8csjwpL8OFuYbxZnLPrDoH6-SCvTAS; _ga_Y2RSHPPW88=GS1.1.1736162594.31.0.1736162602.0.0.1356335706; _ga_HV1FL86553=GS1.1.1736162595.33.0.1736162602.0.0.1355695323; msToken=CRf_yim3I0CGVImR9KGTSZk3zTjibsfBO5HM2jA3YP0Lacss4uN4HAJ4bz-CjGaoVpvS-OMDLUJCQ58YChWC_GUdDjIF5ObYYjZZ5hkixmjZqWrHGqN2yLm7zdiI; odin_tt=9dfc9766999de356b7dd7ed3074a6efdf62dcd42905866e5e811b2b5473571dc2e2425e165f72a6aa4f19660bcb37808; ttwid=1%7C90SBFHRG4A2tbADQWjAQPyp39sPRsmc_J4JZDCnUDQA%7C1736162613%7C8ec1beb1efc7cc75b54465175a4388cfc45d7ed5b8cde33ca6712f075accb19b",
  "Referer": "https://ads.tiktok.com/i18n/manage/adgroup?aadvid=7325100941009731586&columns=campaign_budget%2Cad_id%2Cbudget%2Cbid%2Cschedule%2Cattribution_window%2Cad_name%2Ccreative_id%2Cstat_cost%2Ccpc%2Ccpm%2Cshow_cnt%2Cclick_cnt%2Cctr%2Ctime_attr_convert_cnt%2Ctime_attr_conversion_cost%2Ctime_attr_conversion_rate_imp%2Ctime_attr_effect_cnt%2Ctime_attr_effect_cost%2Ctime_attr_effect_rate%2Ctime_attr_engagement_session%2Ctime_attr_cost_per_engagement_session%2Ctime_attr_engagement_session_per_click&relative_time=4&filters%5B0%5D%5Bfield%5D=ad_ids&filters%5B0%5D%5Bin_field_values%5D%5B0%5D=1817623149104178&filters%5B0%5D%5Bfilter_type%5D=0",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}

async function  getTTAMMetric(params) {

}