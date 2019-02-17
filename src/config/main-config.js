require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views"); // set the path where the templating engine will find the views
const logger = require("morgan");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const passportConfig = require("./passport-config");


// In the following object we are configuring all middleware:

module.exports = {
  init(app, express) { // holds the Express application instance as well as the Express instance

    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "assets"))); // Mount the view and tell Express where to find static assets
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());
    app.use(session({
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 } //set cookie to expire in 14 days
    }));
    app.use(flash());
    passportConfig.init(app);
    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    })

  }
};