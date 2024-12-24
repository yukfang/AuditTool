const crypto        = require('crypto');
const proxying      = require('./http/proxying')
const PixelLib = { 
    'CL11QHJC77UDR4OH8UKG' : 'e6852684567a381406732128a41e3f575a4bcb91', // Test
    'CLLJMLRC77UEE5O898U0' : 'be8e3bc8af6ae0731c1d81720ad85925ad76bb6c', // Elysian 
    'CH3L2OJC77UEADR7DK60' : '58be96d82921d12f5970806582ce70019ff95fb6', // Jasperbird.com
    'CMOU05RC77UE8SFFHCPG' : 'a9bf3d3be4e0fceec19fe52da1dbb79176281df2', // Test
    'COVKTMRC77UF8F9DB520' : '17bd1e8c8a4a8752090e8e4e778a81da36b7d5a0', // Mengdan

}
async function send_event(args) {

    const method   = 'POST'
    const endpoint = 'https:/business-api.tiktok.com/open_api/v1.3/event/track/'
    const header   = {
         'Access-Token' : `${PixelLib[args.pixel_code]}` ,
         'Content-Type' : 'application/json' 
    }
    const param = {}
    const body = {
        "event_source": "web",
        "event_source_id":  `${args.pixel_code}`,
        data: [
            {
                "event"     : args.event_type, 
                "event_time": args.event_time,  
                "event_id"  : args.event_id,  
                "user"      : {
                  "ttclid"      : args.ttclid, 
                  "ip"          : args.ip,
                  "user_agent"  : args.ua,
                  "phone"       : sha256(args.phone || '')
                },
                "page": { 
                  "url"       : `${args.url}`,  
                  "referrer"  : `${args.referrer}`
                },
                "properties": args.properties
              }
        ]
    }

    const response = await proxying(method, endpoint, header, param, body, true);
    console.log(args.pixel_code + ' ' + args.event_type + ' ' + response.data)
    // return  response.data
    return {
        request: body,
        response: response.data
    }
}

function sha256(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

module.exports = send_event