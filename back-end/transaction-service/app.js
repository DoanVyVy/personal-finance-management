require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const cors = require("cors");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Áp dụng authMiddleware cho toàn bộ /api/transactions
app.use("/api/transactions", authMiddleware, transactionRoutes);

sequelize
  .sync({ force: false })
  .then(() => console.log("Transaction DB synced"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Transaction Service running on port ${PORT}`);
});
