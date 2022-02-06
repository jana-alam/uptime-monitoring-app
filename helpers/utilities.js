/*
    Title: utlitites 
    Description: utlitites functions
    Author: Md Jana Alam
    Date: 06 Feb 2022
*/
// depenedencies
const crypto = require("crypto");
const environments = require("../helpers/environments");

// module scaffolding
const utlitites = {};

// parse json string to javascript object after checking

utlitites.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// hash string with crypto model

utlitites.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hashed = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hashed;
  } else {
    return false;
  }
};

// export module

module.exports = utlitites;
