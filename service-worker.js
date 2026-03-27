const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 🔥 Base de datos temporal (en memoria)
let users = {}; 
let resetTokens = {};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


// 📩 1. Solicitar recuperación
app.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString('hex');
  resetTokens[token] = email;

  const resetLink = `http://localhost:3000/reset.html?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"Elite Studios" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Restablecer contraseña",
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Haz click aquí:</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error enviando correo" });
  }
});


// 🔐 2. Cambiar contraseña
app.post('/reset-password', (req, res) => {
  const { token, password } = req.body;

  const email = resetTokens[token];

  if (!email) {
    return res.status(400).json({ error: "Token inválido" });
  }

  users[email] = password; // guardar nueva contraseña
  delete resetTokens[token];

  res.json({ success: true });
});


app.listen(3000, () => console.log("Servidor en http://localhost:3000"));