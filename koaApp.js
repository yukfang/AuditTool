const fs            = require('fs');
const Koa           = require('koa');
const Router        = require('koa-router');
const path          = require('path');
const koaStatic     = require('koa-static');
// const static        = require('koa-static');
const bodyParser    = require('koa-bodyparser');
const koaApp = new Koa();
const router = new Router();

const adv_info_get     = require('./router/mapi/advertiser_get')
const ad_get           = require('./router/mapi/ad_get')
const adgroup_get      = require('./router/mapi/adgroup_get')
const campaign_get     = require('./router/mapi/campaign_get')
const campaign_spc_get = require('./router/mapi/campaign_spc_get')
const change_summary_get = require('./router/mapi/changelog')
const cm_video_get = require('./router/ttam/cm_get_videos')

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
  // if(ctx.path.length !== 0) {
  ctx.body = fs.readFileSync('maintenance.html', {encoding:'utf8', flag:'r'});

  if (ctx.path === '/') {
      if(ctx.method === 'POST') {
          ctx.body = 'OK';
      }
  } else if(ctx.path === '/open_api/v1.3/ad/get/') {
    const { advertiser_id, filtering } = ctx.request.body;
    const ad_data = await ad_get(advertiser_id, filtering)
    ctx.body = ad_data
  } else if(ctx.path === '/open_api/v1.3/advertiser/info/') {
    const { advertiser_id } = ctx.request.body;
    const adv_data = await adv_info_get(advertiser_id)
    ctx.body = adv_data
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
  } else if(ctx.path === '/open_api/v1.3/changesummary/') {
    const { advertiser_id, adgroup_id } = ctx.request.body;
    const change_summary = await change_summary_get(advertiser_id, adgroup_id)
    console.log(`return change summary ${change_summary}`)
    ctx.body = change_summary
  } else if(ctx.path === '/cm/videos/') {
    // const url = ctx.request.url
    const bc_id = ctx.request.query.bc_id
    const catalog_id = ctx.request.query.catalog_id


    const videoList = await cm_video_get(catalog_id, bc_id)
    ctx.body = videoList
  } 
  else {
      // ctx.body = '' + ctx.path;
      // next();
  }
})

/** 
router.get('/', (ctx, next) =>{
  ctx.body = fs.readFileSync('index.html', {encoding:'utf8', flag:'r'});
})
router.get('/engaged-session', (ctx, next) =>{
  ctx.body = fs.readFileSync('audit-engagement-session.html', {encoding:'utf8', flag:'r'});
})
// router.get('/app', (ctx, next) =>{ctx.body = fs.readFileSync('audit-app-s+.html', {encoding:'utf8', flag:'r'});})
router.get('/catalog-video',   (ctx, next) =>{ ctx.body = fs.readFileSync('audit-catalog-video.html',      {encoding:'utf8', flag:'r'});})
router.get('/s\\+app',         (ctx, next) =>{ ctx.body = fs.readFileSync('audit-s+app.html',              {encoding:'utf8', flag:'r'});})
router.get('/s\\+traffic',     (ctx, next) =>{ ctx.body = fs.readFileSync('audit-s+traffic.html',          {encoding:'utf8', flag:'r'});})
router.get('/s\\+lead',        (ctx, next) =>{ ctx.body = fs.readFileSync('audit-s+lead.html',             {encoding:'utf8', flag:'r'});})
router.get('/android-d0',      (ctx, next) =>{ ctx.body = fs.readFileSync('audit-android-d0.html',         {encoding:'utf8', flag:'r'});})
router.get('/s\\+cc',          (ctx, next) =>{ ctx.body = fs.readFileSync('audit-s+cc.html',               {encoding:'utf8', flag:'r'});})


router.get('/location_ids.js', (ctx, next) =>{
  ctx.body = fs.readFileSync('location_ids.js', {encoding:'utf8', flag:'r'});
})
router.get('/fetch_mapi.js', (ctx, next) =>{
  ctx.body = fs.readFileSync('fetch_mapi.js', {encoding:'utf8', flag:'r'});
})
router.get('/fetch_cm_video.js', (ctx, next) =>{
  ctx.body = fs.readFileSync('fetch_mapi.js', {encoding:'utf8', flag:'r'});
})
router.get('/matrix', (ctx, next) =>{
  ctx.body = fs.readFileSync('matrix.html', {encoding:'utf8', flag:'r'});
})
router.get('/header_builder.js', (ctx, next) => {ctx.body = fs.readFileSync('header_builder.js', {encoding:'utf8', flag:'r'})})
router.get('/extract_info.js',   (ctx, next) => {ctx.body = fs.readFileSync('extract_info.js',   {encoding:'utf8', flag:'r'})})


router.get('/css/style.css', (ctx, next) =>{
  console.log(__dirname)
  ctx.body = fs.readFileSync('./assets/css/style.css', {encoding:'utf8', flag:'r'});
})
router.get('/css/home.css', (ctx, next) =>{
  console.log(__dirname)
  ctx.body = fs.readFileSync('./assets/css/home.css', {encoding:'utf8', flag:'r'});
})

router.get('/test.html',   (ctx, next) => {ctx.body = fs.readFileSync('test.html',   {encoding:'utf8', flag:'r'})})
 */

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
