const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");


exports.register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phone,
      role_id
    } = req.body;

    console.log("REGISTER DATA:", req.body);

    const exists = await User.findOne({ where: { email } });
    console.log("EXISTS:", exists ? "SI" : "NO");

    if (exists) {
      return res.status(409).json({ error: "Email ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("PASSWORD HASHED OK");

    console.log("ROLE A USAR:", role_id || 3);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      role_id: role_id || 3
    });

    console.log("USER CREADO:", newUser.id);

    

// 🔐 generar token igual que login
const token = jwt.sign(
  { id: newUser.id, email: newUser.email },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

// 🧼 nunca devolver password
newUser.password = undefined;

res.status(201).json({
  message: "Usuario registrado correctamente",
  token,
  user: newUser
});



  } catch (error) {
    console.error("🔥 REGISTER ERROR REAL:", error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

  

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas email" });
    }

    const passwordOk = await bcrypt.compare(password, user.password);


    if (!passwordOk) {
      return res.status(401).json({ error: "Credenciales inválidas password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    console.log("TOKEN GENERADO");

    res.json({ token });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================
   PERFIL (TEST AUTH)
========================= */
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: Role
    });

    res.json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};