const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");

router.post("/register", register);

module.exports = router;

router.get("/test", (req, res) => {
  res.send("Auth route working");
});