// Middlewar must be instantiated before Express can use it
require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views"); // set the path where the templating engine will find the views

module.exports = {
  init(app, express) { // holds the Express application instance as well as the Express instance
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "assets"))); // Mount the view and tell Express where to find static assets
  }
};