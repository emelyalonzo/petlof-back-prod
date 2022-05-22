
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    from_userId: { type: String, required: true },
    to_userId: { type: String, required: true },
    messsage: { type: String, required: true }
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", MessageSchema);
module.exports = Message;