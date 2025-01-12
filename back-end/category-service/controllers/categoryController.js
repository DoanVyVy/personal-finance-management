const Category = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, type } = req.body;

    const newCategory = await Category.create({
      user_id: userId,
      name,
      type,
    });
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { userId } = req.user;
    const categories = await Category.findAll({ where: { user_id: userId } });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { name, type } = req.body;

    const category = await Category.findOne({ where: { id, user_id: userId } });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name ?? category.name;
    category.type = type ?? category.type;
    await category.save();

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const category = await Category.findOne({ where: { id, user_id: userId } });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.destroy();
    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
