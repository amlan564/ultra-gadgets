const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getRelatedProducts,
  getFeaturedProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/get/:id/related", getRelatedProducts);
router.get("/featured", getFeaturedProducts);

module.exports = router;
