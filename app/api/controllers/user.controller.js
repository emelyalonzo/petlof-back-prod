const User = require("../models/User");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HTTPSTATUSCODE = require("../../utils/httpStatusCode");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

dotenv.config();

//TODO: Eliminar console.log
const createUser = async (req, res, next) => {
  console.log("Create user function")
  try {
    console.log("Try inside")
    const newUser = new User(req.body);
    console.log(`newUser: ${newUser}`)
    //* Se hace destructuring del email y la contraseña para poder modificarlos y usarlos para comprobar en la base de datos.
    const { email, hashed_password } = req.body;
    console.log(`email y hashed_password: ${email} ${hashed_password}`);
    const sanitiziedEmail = email.toLowerCase();
    console.log(`email en lower case: ${sanitiziedEmail}`);
    const existingUser = await User.findOne({ "email" : sanitiziedEmail }); //* Return null if not found
    console.log(`usuario en la db si existe o null si no:${existingUser}`);
    if (existingUser) {
      return next("User already exists. Please login");
    }

    const userUUID = uuidv4();
    console.log(` uuid ${userUUID}`);
    const newHashedPassword = await bcrypt.hash(hashed_password, 10);
    console.log("new hashed password",newHashedPassword)
    //* Es necesario guardar el email en minusculas, la contraseña encriptada y el nuevo ID del usuario.
    newUser.email = sanitiziedEmail;
    newUser.hashed_password = newHashedPassword;
    newUser.user_id = userUUID;
    console.log("newUser modified",newUser);
    const insertUser = await newUser.save();

    //? Ponemos la contraseña a null para crear el token de sesión por términos de seguridad
    insertUser.hashed_password = null;

    //* https://github.com/auth0/node-jsonwebtoken
    const token = jwt.sign({ insertUser, email }, process.env.JWT_SECRET, {
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


//TODO: Eliminar console.log
const logIn = async (req, res, next) => {
  console.log("before try catch")
  try {
    console.log("inside try catch");
    //* Datos que manda el usuario (pueden estar mal)
    let { email, hashed_password } = req.body;
    email = email.toLowerCase();
    console.log(`email y contraseña: ${email} ${hashed_password}`);
    //* Objeto correcto de la base de datos!
    const user = await User.findOne({ "email" : email }); //* Return null if not found
    console.log(`existe usuario en db ${user}`)
    const correctPassword = await bcrypt.compare(hashed_password, user.hashed_password);
    console.log(`contraseña correcta? ${correctPassword}`);
    if (user && correctPassword) {
      //* El usuario y la contraseña son correctos y existen en la base de datos
      //* https://github.com/auth0/node-jsonwebtoken
      console.log("antes del token")
      //? Ponemos la contraseña a null para crear el token de sesión por términos de seguridad
      user.hashed_password = null;
      const token = jwt.sign({ user, email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log(token);
  
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

//?Esta funcion no se usa pues se ha creado una de login que funciona correctamente arriba.
// const authenticate = async (req, res, next) => {
//   try {
//     //Buscamos al user en bd
//     const userInfo = await User.findOne({ email: req.body.email })
//     //Comparamos la contraseña
//     if (bcrypt.compareSync(req.body.password, userInfo.password)) {
//       //eliminamos la contraseña del usuario
//       userInfo.password = null
//       //creamos el token con el id y el name del user
//       const token = jwt.sign(
//         {
//           id: userInfo._id,
//           name: userInfo.name
//         },
//         req.app.get("secretKey"),
//         { expiresIn: "1h" }
//       );
//       //devolvemos el usuario y el token.
//       return res.json({
//         status: 200,
//         message: HTTPSTATUSCODE[200],
//         data: { user: userInfo, token: token },
//       });
//     } else {
//       return res.json({ status: 400, message: HTTPSTATUSCODE[400], data: null });
//     }
//   } catch (err) {
//     return next(err);
//   }
// }

//* LOGOUT FUNCTION (con el resto en la función isAuth de auth.middleware)
const logout = (req, res, next) => {
  console.log("outside try catch");
  try {
    console.log("inside try catch");
    return res.json({
      status: 200,
      message: HTTPSTATUSCODE[200],
      token: null,
    });
  } catch (err) {
    return next(err);
  }
};

//Metodo para actualizar algun registro de la base de datos
const updateUser = async (req, res, next) => {
    try {
        const formData = req.body.formData;
        const userIdReq = formData.user_id;
        const user = await User.findOne({ user_id : userIdReq });

        if (formData.first_name && formData.first_name.length > 0) user.first_name = formData.first_name;
        if (formData.dob_day && formData.dob_day.length > 0 ) user.dob_day = formData.dob_day;
        if (formData.dob_month && formData.dob_month.length > 0 ) user.dob_month = formData.dob_month;
        if (formData.dob_year && formData.dob_year.length > 0 ) user.dob_year = formData.dob_year;
        if (formData.show_gender && formData.show_gender.length > 0 ) user.show_gender = formData.show_gender;
        if (formData.gender_identify && formData.gender_identify.length > 0 ) user.gender_identify = formData.gender_identify;
        if (formData.gender_interest && formData.gender_interest.length > 0 ) user.gender_interest = formData.gender_interest;
        if (formData.imageURL && formData.imageURL.length > 0 ) user.imageURL = formData.imageURL;
        if (formData.about && formData.about.length > 0 ) user.about = formData.about;

        const userDB = await User.findOneAndUpdate({ user_id : userIdReq }, { ...user} , {new : true });

        //*Delete the password so it wont be visible on the json sent
        userDB.hashed_password = null

        //*DEBUG
        console.log(userDB);
        
        if (userDB) {
            return res.json({
            status: 200,
            message: HTTPSTATUSCODE[200],
            data: { userDB }
            });
        } else {
            return res.json({
            status: 403,
            message: HTTPSTATUSCODE[403],
            data: null
            })
        }
    } catch (err) {
      return next(err);
    }
}

module.exports = {
  createUser,
  logIn,
  logout,
  updateUser
};