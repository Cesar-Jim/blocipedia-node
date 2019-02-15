const express = require("express");
const app = express();

const appConfig = require("./config/main-config");
const routeConfig = require("./config/route-config.js");

// MORGAN
const morgan = require("morgan");

appConfig.init(app, express); // pass the app and express variables from main-config
routeConfig.init(app);
app.use(morgan("dev"));

module.exports = app;

