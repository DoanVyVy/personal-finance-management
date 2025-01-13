require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const cors = require("cors");
const authMiddleware = require("./middlewares/authMiddleware");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Chặn tất cả route /api/reports bằng authMiddleware
app.use("/api/reports", authMiddleware, reportRoutes);

// Đồng bộ DB (nếu sử dụng reportModel để lưu)
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Reporting DB synced");
  })
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Reporting Service running on port ${PORT}`);
});
