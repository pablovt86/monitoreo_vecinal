const { Comment, User } = require("../models");


// 📄 TRAER comentarios por reporte
exports.getCommentsByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const comments = await Comment.findAll({
      where: { report_id: reportId, parent_id: null },
      include: [
        { model: User ,attributes: ["id", "firstname"]},
        {
          model: Comment,
          as: "replies",
          include: [{ model: User ,attributes: ["id", "firstname"]}]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json(comments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al traer comentarios" });
  }
};


// ✍️ CREAR comentario
exports.createComment = async (req, res) => {
  try {
    const { content, report_id, parent_id } = req.body;

    const newComment = await Comment.create({
      content,
      report_id,
      parent_id: parent_id || null,
      user_id: req.user.id // 🔥 del token
    });

    res.status(201).json(newComment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear comentario" });
  }
};