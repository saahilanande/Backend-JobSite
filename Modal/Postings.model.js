const { string } = require("joi");
const mongoose = require("mongoose");

const postingSchema = new mongoose.Schema(
  {
    employer_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, lowercase: true, required: true },
    job_description: { type: String, lowercase: true },
    job_type: { type: String, lowercase: true },
    employment_type: { type: String },
    location: { type: String },
    salary: { type: Number, min: 0, max: 999999999, default: 0 },
  },
  {
    collection: "Posting",
    timestamps: true,
  }
);

const Posting = mongoose.model("Posting", postingSchema);

module.exports = Posting;
