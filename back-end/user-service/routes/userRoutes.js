const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Đăng ký
router.post("/signup", userController.signup);

// Đăng nhập
router.post("/login", userController.login);

// Lấy 1 user theo ID (có thể public hoặc bắt token, tuỳ yêu cầu)
router.get("/:id", userController.getUserById);

module.exports = router;
