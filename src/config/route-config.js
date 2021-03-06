// This module exports a function that initializes all our routes
module.exports = {

  init(app) {
    const logger = require("morgan");
    const staticRoutes = require("../routes/static");
    const userRoutes = require("../routes/users");
    const wikiRoutes = require("../routes/wikis");

    if (process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes);
    app.use(logger('dev'));
  }

}