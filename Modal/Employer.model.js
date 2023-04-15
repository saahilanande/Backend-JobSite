const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema(
  {
    company_name: { type: String, lowercase: true },
    name: { type: String, lowercase: true, required: true },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    api_key: { type: String, lowercase: true, required: true },
    usage: { type: Number, require: true },
    phone: { type: Number, min: 0, max: 99999999999, default: 0 },
    location: { type: String },
    industry: { type: String },
    company_description: { type: String },
  },
  { collection: "Employers" }
);

const Employer = mongoose.model("Employer", EmployerSchema);

module.exports = Employer;
