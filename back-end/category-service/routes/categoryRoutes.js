const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Tạo danh mục mới
router.post("/", categoryController.createCategory);

// Lấy tất cả danh mục theo userId
router.get("/", categoryController.getCategoriesByUserId);

// Lấy danh mục theo type và userId
router.get("/by-type", categoryController.getCategoriesByType);

// Lấy danh mục cụ thể theo ID
router.get("/:id", categoryController.getCategoryById);

// Cập nhật danh mục theo ID
router.put("/:id", categoryController.updateCategory);

// Xóa danh mục theo ID
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
