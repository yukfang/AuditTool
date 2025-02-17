module.exports = {
  apps : [
    {
      "ignore_watch" : [
        "node_modules", 
        "assets"
      ],
      "watch_options": {
        "followSymlinks": false,
      },


      script: "./index.js",
      "watch": true,
      name: "TSC Audit Tool"
    }
  ]
}
