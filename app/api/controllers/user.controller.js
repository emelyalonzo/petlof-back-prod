const User = require("../models/User");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors"); 
const HTTPSTATUSCODE = require("../../utils/httpStatusCode");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");




dotenv.config();

//TODO: Eliminar console.log
const createUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    console.log(`newUser: ${newUser}`)
    const { email, hashed_password } = req.body;
    const sanitiziedEmail = email.toLowerCase();
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
      token: token,
      userId: userUUID
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
        token: token,
        userId: user.user_id
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
        console.log(formData);
        console.log(formData.gender_identity)
        const userIdReq = formData.user_id;
        const user = await User.findOne({ user_id : userIdReq });
        console.log(formData.gender_identity);
        const userDB = await User.findOneAndUpdate({ user_id : userIdReq }, { 
          "first_name": formData.first_name,
          "dob_day": formData.dob_day,
          "dob_month": formData.dob_month,
          "dob_year": formData.dob_year,
          "gender_identity": formData.gender_identity,
          "gender_interest": formData.gender_interest,
          "imageURL":formData.imageURL,
          "about": formData.about
        } , {new : true });
        console.log(userDB)
        //*Delete the password so it wont be visible on the json sent
        userDB.hashed_password = null
        
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

const getOneUser = async (req, res, next) => {
  try {
    console.log(req.query)
    const id  = req.query.id;
    console.log(id);
    const user = await User.findOne({user_id : id});
    //*DEBUG
    console.log(user);
    
    if (user) {
        //*Delete the password so it wont be visible on the json sent
        user.hashed_password = null
        return res.json({
        status: 200,
        message: HTTPSTATUSCODE[200],
        data: { user }
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

const getGendersUsers = async (req, res, next) => {
  try {
    console.log(req.query)
    const gender_interest = req.query.gender_interest;
    console.log( gender_interest )
    const users = await User.find({ gender_interest : gender_interest });
    console.log(users);

    if (users) {
      for ( let user of users) {
        user.hashed_password = null
      }
      return res.json({
        status: 200,
        message: HTTPSTATUSCODE[200],
        data: { users }
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
  updateUser,
  getOneUser, 
  getGendersUsers
};