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

// create random token

utlitites.createTokenId = (x) => {
  length = typeof x === "number" && x > 0 ? x : false;
  const possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890";
  let tokenId = "";
  if (length) {
    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * possibleChar.length);
      tokenId += possibleChar.charAt(randomNumber);
    }

    return tokenId;
  }
  return false;
};

// export module

module.exports = utlitites;
