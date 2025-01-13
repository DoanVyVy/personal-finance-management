const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Signup
router.post("/signup", userController.signup);

// Login
router.post("/login", userController.login);

// Lấy user theo id
router.get("/:id", authMiddleware, userController.getUserById);

// Cập nhật user (name, email, v.v.)
router.put("/:id", authMiddleware, userController.updateUser);

// Đổi mật khẩu
router.patch("/:id/password", authMiddleware, userController.changePassword);

module.exports = router;
