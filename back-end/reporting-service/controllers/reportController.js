const axios = require("axios");
const TRANSACTION_SERVICE_URL =
  process.env.TRANSACTION_SERVICE_URL || "http://localhost:3002";
const CATEGORY_SERVICE_URL =
  process.env.CATEGORY_SERVICE_URL || "http://localhost:3003";

const groupTransactionsByTime = (transactions, timeUnit) => {
  const groupedData = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt);
    let groupKey;

    switch (timeUnit) {
      case "yearly":
        groupKey = date.getFullYear(); // Năm
        break;
      case "quarterly":
        groupKey = `${date.getFullYear()}-Q${Math.ceil(
          (date.getMonth() + 1) / 3
        )}`; // Quý
        break;
      case "monthly":
      default:
        groupKey = date.toISOString().slice(0, 7); // Tháng
    }

    if (!groupedData[groupKey]) {
      groupedData[groupKey] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      groupedData[groupKey].income += parseFloat(t.amount);
    } else {
      groupedData[groupKey].expense += parseFloat(t.amount);
    }
  });

  return groupedData;
};

// [GET] /api/reports/income-expenses
exports.getIncomeExpensesReport = async (req, res) => {
  try {
    const { userId } = req.user;
    const { timeUnit = "monthly" } = req.query;

    const response = await axios.get(
      `${TRANSACTION_SERVICE_URL}/api/transactions`,
      {
        headers: { Authorization: req.headers["authorization"] },
      }
    );

    const transactions = response.data;

    const groupedData = groupTransactionsByTime(transactions, timeUnit);

    return res.status(200).json({
      message: `${
        timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)
      } report generated`,
      data: {
        userId,
        groupedData,
      },
    });
  } catch (error) {
    console.error(`Error generating ${timeUnit} report:`, error.message);
    return res.status(500).json({ error: error.message });
  }
};

// [GET] /api/reports/expense-categories
exports.getExpenseCategoriesReport = async (req, res) => {
  try {
    const { userId } = req.user;

    // Lấy ngày hiện tại và giới hạn đầu/cuối tháng
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Lấy danh mục từ CATEGORY_SERVICE
    const categoriesResponse = await axios.get(
      `${CATEGORY_SERVICE_URL}/api/categories?userId=${userId}`,
      {
        headers: { Authorization: req.headers["authorization"] },
      }
    );

    const categories = categoriesResponse.data.data || categoriesResponse.data;

    if (!Array.isArray(categories)) {
      console.error("Categories is not an array:", categories);
      return res.status(500).json({ error: "Invalid categories data format" });
    }

    // Lấy giao dịch từ TRANSACTION_SERVICE
    const transactionsResponse = await axios.get(
      `${TRANSACTION_SERVICE_URL}/api/transactions`,
      {
        headers: { Authorization: req.headers["authorization"] },
      }
    );

    const transactions = transactionsResponse.data;

    // Lọc chỉ giao dịch chi tiêu trong tháng hiện tại
    const expenseTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        t.type === "expense" &&
        transactionDate >= startOfMonth &&
        transactionDate <= endOfMonth
      );
    });
    if (expenseTransactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No expense transactions found for this month" });
    }

    const totalExpense = expenseTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );

    // Nhóm giao dịch theo danh mục
    const categoryData = {};
    expenseTransactions.forEach((t) => {
      const category = categories.find(
        (cat) => String(cat.id) === String(t.category_id)
      );

      const categoryName = category ? category.name : t.note || "Unknown";

      if (!categoryData[categoryName]) {
        categoryData[categoryName] = { amount: 0 };
      }

      categoryData[categoryName].amount += parseFloat(t.amount);
    });

    const groupedData = categoryData;
    // Tính phần trăm cho từng danh mục
    for (const categoryName in groupedData) {
      const category = groupedData[categoryName];
      category.percentage = totalExpense
        ? ((category.amount / totalExpense) * 100).toFixed(2)
        : 0;
    }

    return res.status(200).json({
      message: `Monthly expense categories report generated`,
      data: groupedData,
    });
  } catch (error) {
    console.error(
      `Error generating monthly expense categories report:`,
      error.message
    );
    return res.status(500).json({ error: error.message });
  }
};
