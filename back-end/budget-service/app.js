require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const budgetRoutes = require("./routes/budgetRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use("/api/budgets", authMiddleware, budgetRoutes);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Budget DB synced");
  })
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Budget Service running on port ${PORT}`);
});
