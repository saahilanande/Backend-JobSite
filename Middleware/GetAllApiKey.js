let apiKeyModel = require("../Modal/ApiKey.model");

const getAllApikey = async () => {
  const apiKeysList = [];
  await apiKeyModel
    .find()
    .select("api_key -_id")
    .then((data) => data.map((keys) => apiKeysList.push(keys.api_key)));
  return apiKeysList;
};

module.exports = getAllApikey;
