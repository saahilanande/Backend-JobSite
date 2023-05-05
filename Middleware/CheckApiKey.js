let apiKeyModel = require("../Modal/ApiKey.model");

const getAllApikey = async (apikey) => {
  const apiKeyExist = await apiKeyModel.find({ api_key: apikey });
  if (apiKeyExist.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = getAllApikey;
