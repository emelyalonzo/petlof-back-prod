const express = require("express");
const router = express.Router();
//importamos las funciones del controlador y del middleware
const { createUser, logIn, logout } = require("../controllers/user.controller");
const { isAuth } = require("../../middlewares/auth.middleware")

router.post("/register", createUser);
router.post("/logIn", logIn);
//le añadimos el middleware para que solo sea accesible si el user esta logueado
router.post("/logout", [isAuth], logout)

module.exports = router;