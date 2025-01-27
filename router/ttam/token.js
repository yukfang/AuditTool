const proxying = require('../../util/http/proxying');

async function getToken() {
    const endpoint = `https://ads.tiktok.com/app_store/api/pre-connect?pass=${process.env.pass}`
        const method    = 'GET';
        let header      = {};
        let param       = {}; 
        let body        = {}    
        const response = (await proxying(method, endpoint, header, param, body, true));
        // console.log(response)
        if(response.status === 200) {
            const data = JSON.parse(response.data)
            // console.log(data.cookie)
            return data.cookie
        } else {
            console.log(`Status not 200`)
            return ''
        }
}

module.exports = getToken