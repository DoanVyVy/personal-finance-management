const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET_KEY = process.env.SECRET_KEY || "MY_SUPER_SECRET";
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || "1d";

// [POST] /api/users/signup
exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Tạo user
    const newUser = await User.create({
      email,
      password: hashedPass,
      name,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [POST] /api/users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // So sánh password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Tạo token
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRE,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [GET] /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [PUT] /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Tìm user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Cập nhật
    // Bạn có thể thêm điều kiện "email đã tồn tại chưa" nếu muốn.
    if (name !== undefined) {
      user.name = name;
    }
    if (email !== undefined) {
      // Kiểm tra email trùng?
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail && existingEmail.id !== parseInt(id, 10)) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
    }

    await user.save();

    // Trả về user đã cập nhật, ẩn password
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// [PATCH] /api/users/:id/password
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Tìm user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // So sánh oldPassword
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash password mới
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
