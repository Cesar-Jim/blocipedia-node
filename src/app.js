// app.js contains the express application

const express = require("express");
const app = express();

const appConfig = require("./config/main-config");
const routeConfig = require("./config/route-config.js");

appConfig.init(app, express); // pass the app and express variables from main-config
routeConfig.init(app);

module.exports = app;

