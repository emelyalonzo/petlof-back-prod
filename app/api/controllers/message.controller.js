const Message = require("../models/Message");
const HTTPSTATUSCODE = require("../../utils/httpStatusCode");


//For display all chat history between two users. 
const getMessages = async (req, res, next) => {
//   try {
//     if (req.query.page) { //Se le añade paginación
//       const page = parseInt(req.query.page);
//       const skip = (page - 1) * 20;
//       const colors = await Color.find().skip(skip).limit(20);
//       return res.json({
//         status: 200,
//         message: HTTPSTATUSCODE[200],
//         data: { colors: colors },
//       });
//     } else {
//       const colors = await Color.find();
//       return res.json({
//         status: 200,
//         message: HTTPSTATUSCODE[200],
//         data: { colors: colors },
//       });
//     }
//   } catch (err) {
//     return next(err);
//   }
};

// For creating a new message in a conversation
const postMessage = async (req, res, next) => {
//   try {
//     const { colorId } = req.params;
//     const colorById = await Color.findById(colorId);
//     return res.json({
//       status: 200,
//       message: HTTPSTATUSCODE[200],
//       data: { colors: colorById }
//     });
//   } catch (err) {
//     return next(err);
//   }
};
//Exportamos las funciones
module.exports = {
    getMessages,
    postMessage,
}