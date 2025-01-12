const Transaction = require("../models/transactionModel");

// [POST] /api/transactions
exports.createTransaction = async (req, res) => {
  try {
    const { userId } = req.user; // Lấy từ token
    const { amount, type, note } = req.body;

    const newTransaction = await Transaction.create({
      user_id: userId,
      amount,
      type,
      note,
    });
    return res.status(201).json(newTransaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [GET] /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { userId } = req.user;
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
    });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [GET] /api/transactions/:id
exports.getTransactionById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [PUT] /api/transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { amount, type, note } = req.body;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    transaction.amount = amount ?? transaction.amount;
    transaction.type = type ?? transaction.type;
    transaction.note = note ?? transaction.note;

    await transaction.save();
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [DELETE] /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.destroy();
    return res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
