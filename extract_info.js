function extractInfo(prop, campaignData, adGroupData, creativeData) {
    if (prop in campaignData) {
        return campaignData[prop];
    } else if (prop in adGroupData) {
        return adGroupData[prop];
    } else if (prop in creativeData) {
        return creativeData[prop];
    }
    return null; 
}