const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HTTPSTATUSCODE = require("../../utils/httpStatusCode");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

const createUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    //! Se hace destructuring del email y la contraseña para poder modificarlos y usarlos para comprobar en la base de datos.
    const { email, password } = req.body;

    const sanitiziedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ sanitiziedEmail });
    if (existingUser) {
      return next("User already exists. Please login");
    }

    const userUUID = uuidv4();
    const hashedpassword = await bcrypt.hash(password, 10);
    //! Es necesario guardar el email en minusculas, la contraseña encriptada y el nuevo ID del usuario.
    newUser.email = sanitiziedEmail;
    newUser.hashed_password = hashedpassword;
    newUser.user_id = userUUID;

    const insertUser = await newUser.save();

    const token = jwt.sign(insertUser, req.app.get("secretKey"), {
      expiresIn: "1h",
    });

    return res.json({
      status: 201,
      message: HTTPSTATUSCODE[201],
      data: token,
      user_id: userUUID,
      email: sanitiziedEmail,
    });
  } catch (err) {
    return next(err);
  }
};

//TODO: Revisar
const logIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email });
    const { email, password } = req.body;

    const correctPassword = await bcrypt.compare(password, user.hashedpassword);

    if (user & correctPassword) {
      const token = jwt.sign(user, email, req.app.get("secretKey"), {
        expiresIn: "1h",
      });
      return res.json({
        status: 200,
        message: HTTPSTATUSCODE[200],
        data: token,
        user_id: user.user_id,
        email: user.email,
      });
    } else {
      return res.json({
        status: 400,
        message: HTTPSTATUSCODE[400],
        data: null,
      });
    }
  } catch (err) {
    return next(err);
  }
};

//TODO: Revisar codigo
// //* LOGOUT FUNCTION
const logout = (req, res, next) => {
  try {
    return res.json({
      status: 200,
      message: HTTPSTATUSCODE[200],
      token: null,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createUser,
  logIn,
  logout,
};
