const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Báo cáo thu nhập và chi tiêu theo thời gian
router.get("/income-expenses", reportController.getIncomeExpensesReport);

// Báo cáo chi tiêu theo danh mục và thời gian
router.get("/expense-categories", reportController.getExpenseCategoriesReport);

module.exports = router;
