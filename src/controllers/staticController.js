// In MCV, the controller handles a request for a particular resource

module.exports = {

  // index is the handler function for the route: "static/index"
  index(req, res, next) {
    res.render("static/index", { title: "Welcome to Blocipedia" }); // returns to <% title %> in index.ejs: "Welcome to Blocipedia"
  }
}