const express = require("express");
const matchRouter = express.Router();

//importamos las funciones del controlador y del middleware
const { addMatch } = require("../controllers/user.controller");
const { isAuth } = require("../../middlewares/auth.middleware");


matchRouter.put("/addmatch", addMatch);


module.exports = matchRouter;