const mongoose = require("mongoose");
const database = require("../../config/database");
const User = require("../models/User");

const users = [
  {
    user_id: "1",
    email: "catpower@gmail.com",
    hashed_password: "123",
    first_name: "Cat Power",
    dob_day: "1",
    dob_month: "1",
    dob_year: "2010",
    gender_identity: "male",
    gender_interest: "female",
    imageURL: "https://imgur.com/gallery/crdP5jh",
    about: "Soy un gato juguetón, me encanta jugar al gato y al ratón",
    matches: [],
    banned: [],
  },
];

const usersDocuments = users.map((user) => new User(user));

// Conectaremos con DB y desconectaremos tras insertar los documentos
database.connectDB()

// Ver si hay usuarios y eliminarlos
    .then(async () => {
        const allUsers = await User.find();
        if (allUsers.lenght > 0) {
            await User.collection.drop();
        }
    })
    .catch((err) => console.error(`Error eliminado información de la DB: ${err}`))

  // Añadir documentos de bicicletas a la base de datos
    .then(async () => {
        await User.insertMany(usersDocuments);
    })
    .catch((err) => console.error(`Error creando documentos en DB: ${err}`))

  // Cerrar la conexión
    .finally(() => mongoose.disconnect());