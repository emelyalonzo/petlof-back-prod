const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HTTPSTATUSCODE = require("../../utils/httpStatusCode");


//* SIGNUP FUNCTION
const createUser = async (req, res, next) => {
  try {
    const newUser = new User();
    //! newUser.user_id MIRAR CON UUID DE ANIKA
    newUser.first_name = req.body.first_name;
    newUser.imageURL = req.body.imageURL;
    newUser.about = req.body.about;
    newUser.email = req.body.email;
    newUser.hashed_password = req.body.hashed_password;
    newUser.dob_day = req.body.dob_day;
    newUser.dob_month = req.body.dob_month;
    newUser.dob_year = req.body.dob_year;
    newUser.gender_identify = req.body.gender_identify;
    newUser.gender_interest = req.body.gender_interest;

    //! Encriptar contraseña

    //TODO: Completar info de registro con los inputs del formulario de react

    //TODO: Comprobar si el usuario existe antes de guardar
    
    const userDb = await newUser.save();
    
    //TODO: Autenticar directamente al usuario

    return res.json({
      status: 201,
      message: HTTPSTATUSCODE[201],
      data: null

      //! Si se hace login directamente, se tendría que enviar el token como en Autenticate. 
    
    });
  } catch (err) {
    return next(err);
  }
}
//* AUTH FUNCTION
const authenticate = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({ email: req.body.email })
    //Comparamos la contraseña
    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      //eliminamos la contraseña del usuario
      userInfo.password = null
      //creamos el token con el id y el name del user
      const token = jwt.sign(
        {
          id: userInfo._id,
          name: userInfo.name
        },
        req.app.get("secretKey"),
        { expiresIn: "1h" }
      );
      //devolvemos el usuario y el token.
      return res.json({
        status: 200,
        message: HTTPSTATUSCODE[200],
        data: { user: userInfo, token: token },
      });
    } else {
      return res.json({ status: 400, message: HTTPSTATUSCODE[400], data: null });
    }
  } catch (err) {
    return next(err);
  }
}
//* LOGOUT FUNCTION
const logout = (req, res, next) => {
  try {
    return res.json({
      status: 200,
      message: HTTPSTATUSCODE[200],
      token: null
    });
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  createUser,
  authenticate,
  logout
}