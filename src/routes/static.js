const express = require("express");
const router = express.Router();
const staticControler = require("../controllers/staticController");

router.get("/", staticControler.index)

module.exports = router;