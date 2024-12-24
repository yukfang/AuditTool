async function fetchAdgroupData(advertiserId, adgroupId) {
    return await fetchData('/open_api/v1.3/adgroup/get/', advertiserId, null, adgroupId);
}
async function fetchCampaignData(advertiserId, campaignId) {
    return await fetchData('/open_api/v1.3/campaign/get/', advertiserId, campaignId, null);
}
async function fetchSpcCampaignData(advertiserId, campaignId) {
    return await fetchData('/open_api/v1.3/campaign/spc/get/', advertiserId, campaignId, null);
}
async function getCreativeData(advertiserId, adgroupId) {
    console.log(`creative filter = ${adgroupId}`)
    return await fetchData('/open_api/v1.3/ad/get/', advertiserId, null,  adgroupId);
}

async function fetchData(url, advertiserId, campaignId, adgroupId) { 
    try {
        const filtering = {}
        if(campaignId !== null) {
            filtering.campaign_ids = [campaignId]
        }
        if(adgroupId !== null) {
            filtering.adgroup_ids = [adgroupId]
        }
        console.log(`FE: filtering = ${JSON.stringify(filtering)}`)
        const response = await fetch(url, {
            method: 'POST',
            page_size: 1000,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertiser_id: advertiserId,
                filtering
            })
        }); // ignore_security_alert SSRF

        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        alert("Failed to fetch campaign data. Please check the console for details.");
        throw error;
    }
}