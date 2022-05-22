const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    user_id: { type: String},
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String},
    dob_day: {type: Number},
    dob_month: {type: Number},
    dob_year:  {type: Number},
    show_gender:  {type: Boolean},
    gender_identity:  {type: String},
    gender_interest:  {type: String},
    imageURL:  {type: String}, 
    about:  {type: String},
   },  { 
       timestamps: true
     }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;