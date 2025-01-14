const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// Nếu bạn có middleware auth, import và dùng như sau:
// const authMiddleware = require("../middleware/authMiddleware");
// router.use(authMiddleware);

// [POST] /api/budgets
router.post("/", budgetController.createBudget);

// [GET] /api/budgets
router.get("/", budgetController.getBudgets);

// [PUT] /api/budgets/:id
router.put("/:id", budgetController.updateBudget);

// [DELETE] /api/budgets/:id
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
