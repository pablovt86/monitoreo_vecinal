const router = require("express").Router();
const {
  register,
  login,
  profile
} = require("../controllers/authController");

const auth = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);

module.exports = router;
