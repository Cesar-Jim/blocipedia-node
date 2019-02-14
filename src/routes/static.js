const express = require("express");
const router = express.Router();

// Define a route on our Express application using use()
// "/" = pattern
// (req, res, next) = route handler
// next passes control on to the next matching route
// "Welcome to Blocipedia!" will be available in the body of the response
router.get("/", (req, res, next) => {
  res.send("Welcome to Blocipedia!")
});

module.exports = router;