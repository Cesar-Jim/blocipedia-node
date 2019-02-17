// The route associates an HTTP verb with a URL and a handler

const express = require("express");
const router = express.Router();
const staticControler = require("../controllers/staticController");

router.get("/", staticControler.index); // "/" = the URL and "staticController" = handler

module.exports = router;