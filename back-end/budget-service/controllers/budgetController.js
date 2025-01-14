const Budget = require("../models/budgetModel");
const { Op } = require("sequelize");

// [POST] /api/budgets
exports.createBudget = async (req, res) => {
  try {
    // Lấy userId từ middleware auth
    const { userId } = req.user;

    // Lấy dữ liệu từ body
    const { category_id, limit_amount, spent, start_date, end_date } = req.body;
    console.log(req.body);
    // Tạo mới Budget
    // spent có thể để mặc định = 0 nếu không gửi lên
    const newBudget = await Budget.create({
      user_id: userId,
      category_id,
      limit_amount,
      spent: spent ?? 0,
      start_date,
      end_date,
    });

    // Trả về bản ghi mới
    return res.status(201).json(newBudget);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [GET] /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const { userId } = req.user;

    // Chỉ lấy các budget chưa hết hạn (end_date >= hôm nay)
    const budgets = await Budget.findAll({
      where: {
        user_id: userId,
        end_date: {
          [Op.gte]: new Date(), // lấy từ hôm nay trở đi
        },
      },
      // attributes: [...] // nếu muốn giới hạn cột, còn ko sẽ trả hết
    });

    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [PUT] /api/budgets/:id
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, limit_amount, start_date, end_date, spent } = req.body;
    // Tìm budget theo id và cập nhật
    const budget = await Budget.findByPk(id);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    budget.category_id = category;
    budget.limit_amount = limit_amount;
    budget.start_date = start_date;
    budget.end_date = end_date;
    if (spent !== undefined) {
      budget.spent = spent;
    }
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

    // Tìm budget thuộc userId và id
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
