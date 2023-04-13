const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, lowercase: true, required: true },
    last_name: { type: String, lowercase: true, required: true },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    phone: { type: Number, min: 0, max: 99999999999, default: 0 },
    location: { type: String, lowercase: true },
    skills: [
      {
        skill_name: { type: String, lowercase: true },
        skill_level: { type: Number, min: 0, max: 11, default: 0 },
      },
    ],
  },
  { collection: "User" }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
