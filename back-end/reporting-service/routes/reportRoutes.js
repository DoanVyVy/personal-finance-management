const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Báo cáo tổng hợp theo tháng
router.get("/monthly", reportController.getMonthlyReport);

// Báo cáo theo danh mục
router.get("/byCategory", reportController.getByCategoryReport);

module.exports = router;
