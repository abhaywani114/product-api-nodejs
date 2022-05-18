const express = require('express')
const router = express.Router();
const asyncWapper = require("express-async-wrapper");

const ProductController = require("../controllers/product");


router.get("/", ProductController.getAllProducts);
router.get("/search", ProductController.searchProducts);

module.exports = router;
