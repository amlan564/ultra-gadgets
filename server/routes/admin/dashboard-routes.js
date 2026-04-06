const express = require("express");
const {
  dashboardData,
} = require("../../controllers/admin/dashboard-controller");
const router = express.Router();

router.get("/get", dashboardData);

module.exports = router;
