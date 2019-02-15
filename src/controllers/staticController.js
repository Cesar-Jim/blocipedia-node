module.exports = {
  index(req, res, next) {

    // render takes the location of the template as well as an object containing the data we need in the template
    res.render("static/index", { title: "Welcome to Blocipedia" });
  }
}