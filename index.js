// Framework usage: https://bnpm.bytedance.net/package/@bytefaas/nodejs-framework-httpserver
const { Logger } = require("@byted-service/logger");
const logger = new Logger();
const {koaApp, init} = require('./koaApp');
const PORT = process.env.PORT || 80


if(process.env.PLATFORM == 'FAAS') { // Set this ENV in FAAS to make it work
    exports.handler = koaApp.callback();
    exports.initializer = init;
} else {
    init();
    koaApp.listen(PORT); 
}


