require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // <-- import cors
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Kích hoạt cors trước các middleware/route khác
app.use(cors()); // <-- bật cors
app.use(bodyParser.json());

// Định nghĩa routes
app.use("/api/users", userRoutes);

// Kết nối DB
sequelize
  .sync({ force: false })
  .then(() => console.log("User DB synced"))
  .catch((err) => console.error("DB sync error:", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
