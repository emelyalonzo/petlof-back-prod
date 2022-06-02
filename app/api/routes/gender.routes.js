const express = require("express");
const genderRouter = express.Router();

//importamos las funciones del controlador y del middleware
const { getGendersUsers} = require("../controllers/user.controller");
const { isAuth } = require("../../middlewares/auth.middleware")


genderRouter.get("/", getGendersUsers);


module.exports = genderRouter;