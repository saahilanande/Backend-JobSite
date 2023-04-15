const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema(
  {
    email: { type: String, lowercase: true, required: true },
    api_key: { type: String, required: true },
    usage: { type: Number, require: true },
  },
  { collection: "ApikeyCollections" }
);

const ApikeyCollections = mongoose.model("ApikeyCollections", apiKeySchema);

module.exports = ApikeyCollections;
