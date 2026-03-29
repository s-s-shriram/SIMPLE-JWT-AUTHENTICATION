const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    const verifyURL = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await sendEmail(email, "Verify Email", `
      <h2>Verify Your Email</h2>
      <a href="${verifyURL}">Click here</a>
    `);

    res.json({ msg: "Verification email sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};