// This module exports a function that initializes all our routes
module.exports = {

  init(app) {
    const staticRoutes = require("../routes/static");
    const userRoutes = require("../routes/users");

    app.use(staticRoutes);
    app.use(userRoutes);
  }

}