require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
app.use(bodyParser.json());

app.use("/api/categories", authMiddleware, categoryRoutes);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Category DB synced");
  })
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Category Service running on port ${PORT}`);
});
