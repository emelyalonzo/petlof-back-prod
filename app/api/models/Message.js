
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    fromUserID: { type: String, required: true },
    toUserID: { type: String, required: true },
    messsage: { type: String, required: true }
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", MessageSchema);

module.exports = Message;