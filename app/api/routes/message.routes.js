//Importamos express
const express = require("express");
//Guardamos la funcion express.Router() en una variable
const router = express.Router();

//Importamos las funciones del controlador de color
const { getAllColors, getColorById } = require("../controllers/color.controller");
//Definimos el metodo, la ruta de entrada y la función del controlador
//que se encargará de efectuar la lógica
router.get("/", getAllColors);
router.get("/:colorId", getColorById);
//exportamos la variable router
module.exports = router;