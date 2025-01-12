const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    report_type: {
      type: DataTypes.STRING(50), // ví dụ: 'monthly', 'byCategory'
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON, // Lưu kết quả báo cáo dạng JSON
      allowNull: true,
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  }
);

module.exports = Report;
