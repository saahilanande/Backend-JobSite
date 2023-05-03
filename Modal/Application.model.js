const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Types.ObjectId, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
    application_date: { type: Date, require: true },
    resume_file: { type: String },
  },
  { collection: "Application" }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
