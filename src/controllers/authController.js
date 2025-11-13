const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const User = require("../models/userModel");
const { addToBlacklist } = require("../utils/tokenBlacklist");

const register = async (req, res) => {
  try {
    const { username, useremail, password, role } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, useremail, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: `User registered with username ${username}` });
  } catch (err) {
    res.status(500).json({ message: `Something went wrong` });
  }
};

const login = async (req, res) => {
  try {
    const { useremail, password } = req.body;
    const user = await User.findOne({ useremail });

    if (!user) {
      return res.status(404).json({ message: `User with email ${useremail} not found` });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Invalid credentials` });
    }

    const jti = randomBytes(16).toString("hex");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h", jwtid: jti }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: `Something went wrong` });
  }
};

//Admin login
const adminLogin = async (req, res) => {
  try {
    const { useremail, password } = req.body;
    const user = await User.findOne({ useremail });

    if (!user) {
      return res.status(404).json({ message: `User with email ${useremail} not found` });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Invalid credentials` });
    }

    const jti = randomBytes(16).toString("hex");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h", jwtid: jti }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: `Something went wrong` });
  }
};

const logout = async (req, res) => {
  try {
    // Route is protected; token already verified in middleware.
    // Add token's JTI to blacklist until its original expiry.
    const { jti, exp } = req.user || {};
    if (jti && exp) {
      addToBlacklist(jti, exp);
    }
    res.status(200).json({ message: "Logout successful. Token revoked on server. Please remove token on client." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { register, login, adminLogin, logout };

