const fs            = require('fs');
const Koa           = require('koa');
const Router        = require('koa-router');
const path          = require('path');
const koaStatic     = require('koa-static');
// const static        = require('koa-static');
const bodyParser    = require('koa-bodyparser');
const koaApp = new Koa();
const router = new Router();

const ad_get           = require('./router/mapi/ad_get')
const adgroup_get      = require('./router/mapi/adgroup_get')
const campaign_get     = require('./router/mapi/campaign_get')
const campaign_spc_get = require('./router/mapi/campaign_spc_get')

koaApp.use(koaStatic(path.join(__dirname, 'assets'))); // 本地

koaApp.use(bodyParser())
koaApp.use(router.routes()).use(router.allowedMethods())

koaApp.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
koaApp.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});



// router.get('/open_api/v1.3/adgroup/get/', adgroup_get)

// response
koaApp.use(async (ctx, next) => {
  if (ctx.path === '/') {
      if(ctx.method === 'POST') {
          ctx.body = 'OK';
      }
  } else if(ctx.path === '/open_api/v1.3/ad/get/') {
    const { advertiser_id, filtering } = ctx.request.body;
    const ad_data = await ad_get(advertiser_id, filtering)
    ctx.body = ad_data
  } else if(ctx.path === '/open_api/v1.3/adgroup/get/') {
    const { advertiser_id, filtering } = ctx.request.body;
    console.log(`filter = ${JSON.stringify(filtering)}`)
    const adgroup_data = await adgroup_get(advertiser_id, filtering)
    ctx.body = adgroup_data
  } else if(ctx.path === '/open_api/v1.3/campaign/get/') {
    const { advertiser_id, filtering } = ctx.request.body;
    const campaign_data = await campaign_get(advertiser_id, filtering)
    ctx.body = campaign_data
  }  else if(ctx.path === '/open_api/v1.3/campaign/spc/get/') {
    const { advertiser_id, filtering } = ctx.request.body;
    const campaign_data = await campaign_spc_get(advertiser_id, filtering.campaign_ids)
    ctx.body = campaign_data
  } else {
      // ctx.body = '' + ctx.path;
      // next();
  }
})

router.get('/', (ctx, next) =>{
  ctx.body = fs.readFileSync('index.html', {encoding:'utf8', flag:'r'});
})
router.get('/engaged-session', (ctx, next) =>{
  ctx.body = fs.readFileSync('engaged-session.html', {encoding:'utf8', flag:'r'});
})
router.get('/app', (ctx, next) =>{
  ctx.body = fs.readFileSync('app.html', {encoding:'utf8', flag:'r'});
})
router.get('/fetchdata.js', (ctx, next) =>{
  ctx.body = fs.readFileSync('fetchdata.js', {encoding:'utf8', flag:'r'});
})
router.get('/matrix', (ctx, next) =>{
  ctx.body = fs.readFileSync('matrix.html', {encoding:'utf8', flag:'r'});
  // next();
})


router.get('/css/style.css', (ctx, next) =>{
  console.log(__dirname)
  ctx.body = fs.readFileSync('./assets/css/style.css', {encoding:'utf8', flag:'r'});
})
router.get('/css/home.css', (ctx, next) =>{
  console.log(__dirname)
  ctx.body = fs.readFileSync('./assets/css/home.css', {encoding:'utf8', flag:'r'});
})




async function init() {

}

function getCookieValue(cookieString, key) {
  // Split the cookie string into individual cookies
  const cookies = cookieString.split(';');

  // Iterate through each cookie to find the desired key-value pair
  for (const cookie of cookies) {
    // Trim any leading or trailing whitespace
    const [cookieKey, cookieValue] = cookie.trim().split('=');
    // Check if the cookie key matches the desired key
    if (cookieKey === key) {
      // Return the value if found
      return cookieValue;
    }
  }

  // Return null if the key is not found
  return null;
}

module.exports = {
  koaApp,
  init,
};
