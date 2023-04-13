const mongoose = require("mongoose");

const postingSchema = new mongoose.Schema(
  {
    employer_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, lowercase: true, required: true },
    job_description: { type: String, lowercase: true },
    job_type: { type: String, lowercase: true },
    location: { type: String, lowercase: true },
    salary: { type: Number, min: 0, max: 9999999, default: 0 },
    post_date: { type: Date, require: true },
  },
  { collection: "Posting" }
);

const Posting = mongoose.model("Posting", postingSchema);

module.exports = Posting;
