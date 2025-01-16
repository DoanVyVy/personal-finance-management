const Category = require("../models/categoryModel");

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { userId } = req.user; // Lấy userId từ middleware
    const { name, type } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    const newCategory = await Category.create({
      user_id: userId,
      name,
      type,
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({ error: "Failed to create category" });
  }
};

// Lấy tất cả danh mục theo userId
exports.getCategoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.user; // Lấy userId từ middleware

    const categories = await Category.findAll({ where: { user_id: userId } });
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category by ID:", error.message);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { name, type } = req.body;

    const category = await Category.findOne({ where: { id, user_id: userId } });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (name) category.name = name;
    if (type) category.type = type;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error.message);
    return res.status(500).json({ error: "Failed to update category" });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const category = await Category.findOne({ where: { id, user_id: userId } });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.destroy();

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    return res.status(500).json({ error: "Failed to delete category" });
  }
};

// Lấy danh mục theo type và userId
exports.getCategoriesByType = async (req, res) => {
  try {
    const { userId } = req.user; // Lấy userId từ middleware
    const { type } = req.query; // Lấy type từ query parameter

    // Kiểm tra nếu type không hợp lệ
    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid or missing type" });
    }

    // Tìm danh mục dựa vào type và userId
    const categories = await Category.findAll({
      where: { user_id: userId, type },
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories by type:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch categories by type" });
  }
};
