const express = require("express");

const router = express.Router();

const { flickrItems } = require("./flickr-items/flickrItems");

router.get("/items", flickrItems);

module.exports = router;
