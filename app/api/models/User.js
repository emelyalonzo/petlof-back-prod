const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
      //?Se ha borrado el show_me porque no era necesario
    user_id: { type: String},
    email: { type: String, required: true },
    hashed_password: { type: String, required: true },
    first_name: { type: String},
    dob_day: {type: Number},
    dob_month: {type: Number},
    dob_year:  {type: Number},
    gender_identity:  {type: String},
    gender_interest:  {type: String},
    imageURL:  {type: String}, 
    about:  {type: String},
    matches: [{ type: Schema.Types.ObjectId, ref: "User" }],
    banned: [{ type: Schema.Types.ObjectId, ref: "User" }],
   },  { 
       timestamps: true
     }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;