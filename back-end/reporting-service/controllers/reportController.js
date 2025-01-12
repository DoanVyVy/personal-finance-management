const axios = require("axios");
const Report = require("../models/reportModel"); // nếu bạn muốn lưu DB, nếu không thì bỏ

const TRANSACTION_SERVICE_URL =
  process.env.TRANSACTION_SERVICE_URL || "http://localhost:3002";

// [GET] /api/reports/monthly
exports.getMonthlyReport = async (req, res) => {
  try {
    const { userId } = req.user; // Lấy từ JWT
    // Gọi sang Transaction Service để lấy danh sách giao dịch của user
    // Transaction Service endpoint: GET /api/transactions
    const response = await axios.get(
      `${TRANSACTION_SERVICE_URL}/api/transactions`,
      {
        headers: { Authorization: req.headers["authorization"] },
        // Forward token để Transaction Service cũng xác thực
      }
    );

    const transactions = response.data; // Mảng giao dịch
    // Xử lý, nhóm giao dịch theo tháng, tính tổng
    // Ví dụ: group by YYYY-MM

    const monthlyData = {};
    transactions.forEach((t) => {
      // t.createdAt => format YYYY-MM
      const date = new Date(t.createdAt);
      const yearMonth = date.toISOString().slice(0, 7); // "YYYY-MM"
      if (!monthlyData[yearMonth]) {
        monthlyData[yearMonth] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthlyData[yearMonth].income += parseFloat(t.amount);
      } else {
        monthlyData[yearMonth].expense += parseFloat(t.amount);
      }
    });

    // Tạo 1 object kết quả
    const reportResult = {
      userId,
      monthlyData,
    };

    // (Tuỳ chọn) Lưu DB
    // Ví dụ:
    // const savedReport = await Report.create({
    //   user_id: userId,
    //   report_type: 'monthly',
    //   data: reportResult
    // });

    return res.status(200).json({
      message: "Monthly report generated",
      data: reportResult,
      // data: savedReport.data,  // nếu đã lưu
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [GET] /api/reports/byCategory
exports.getByCategoryReport = async (req, res) => {
  try {
    const { userId } = req.user;
    // Lấy giao dịch
    const response = await axios.get(
      `${TRANSACTION_SERVICE_URL}/api/transactions`,
      {
        headers: { Authorization: req.headers["authorization"] },
      }
    );
    const transactions = response.data;

    // Group by category_id
    const categoryData = {};
    transactions.forEach((t) => {
      const catId = t.category_id || 0; // 0 = chưa có category
      if (!categoryData[catId]) {
        categoryData[catId] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        categoryData[catId].income += parseFloat(t.amount);
      } else {
        categoryData[catId].expense += parseFloat(t.amount);
      }
    });

    const reportResult = {
      userId,
      categoryData,
    };

    // (Tuỳ chọn) Lưu DB
    // const savedReport = await Report.create({
    //   user_id: userId,
    //   report_type: 'byCategory',
    //   data: reportResult
    // });

    return res.status(200).json({
      message: "Category report generated",
      data: reportResult,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
