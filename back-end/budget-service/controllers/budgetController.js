const Budget = require("../models/budgetModel");

// [POST] /api/budgets
exports.createBudget = async (req, res) => {
  try {
    const { userId } = req.user;
    const { category_id, limit_amount, start_date, end_date } = req.body;

    const newBudget = await Budget.create({
      user_id: userId,
      category_id,
      limit_amount,
      start_date,
      end_date,
    });
    return res.status(201).json(newBudget);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [GET] /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const { userId } = req.user;
    const budgets = await Budget.findAll({ where: { user_id: userId } });
    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [PUT] /api/budgets/:id
exports.updateBudget = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { category_id, limit_amount, start_date, end_date } = req.body;

    const budget = await Budget.findOne({ where: { id, user_id: userId } });
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    budget.category_id = category_id ?? budget.category_id;
    budget.limit_amount = limit_amount ?? budget.limit_amount;
    budget.start_date = start_date ?? budget.start_date;
    budget.end_date = end_date ?? budget.end_date;

    await budget.save();
    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [DELETE] /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const budget = await Budget.findOne({ where: { id, user_id: userId } });
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    await budget.destroy();
    return res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
