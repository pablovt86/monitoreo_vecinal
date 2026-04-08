const router = require("express").Router();
const {
  getCommentsByReport,
  createComment
} = require("../controllers/commentController");

const auth = require("../middlewares/authMiddleware");

// 📄 obtener comentarios
router.get("/report/:reportId", getCommentsByReport);

// ✍️ crear comentario
router.post("/", auth, createComment);

module.exports = router;