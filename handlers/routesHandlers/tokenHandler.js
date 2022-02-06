/*
    Title: Token handler
    Description: handle user token
    Author: Md Jana Alam
    Date: 06 Feb 2022
*/

// dependencies
const data = require("../../lib/data");
const { hash, parseJSON, createTokenId } = require("../../helpers/utilities");
// handler object - module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "You are not allowed",
    });
  }
};

// to handle diffrent method of user api
// _usrer scaffoldling
handler._token = {};

// post method
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length >= 6
      ? requestProperties.body.password
      : false;

  //   check all fields are available
  if (phone && password) {
    // make sure user exists
    data.read("users", phone, (err, userInfo) => {
      if (!err && userInfo) {
        const userData = { ...parseJSON(userInfo) };
        const hashedPassword = hash(password);

        if (userData.password === hashedPassword) {
          const tokenId = createTokenId(20);
          const expires = Date.now() + 60 * 60 * 1000;
          // token object
          const tokenObject = { phone, tokenId, expires };
          // save token in database
          data.create("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { message: "server side error" });
            }
          });
        } else {
          callback(404, {
            message: "Password does not match",
          });
        }
      } else {
        callback(404, {
          error: "user not exist!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Your request is not valid",
    });
  }
};
// get method
handler._token.get = (requestProperties, callback) => {
  //   check the token is valid
  const tokenId =
    typeof requestProperties.queryStringObject.tokenId === "string" ||
    requestProperties.queryStringObject.tokenId.trim().length === 20
      ? requestProperties.queryStringObject.tokenId
      : false;
  console.log(tokenId);

  if (tokenId) {
    // look up the token
    data.read("tokens", tokenId, (err, token) => {
      if (!err && token) {
        const tokenInfo = { ...parseJSON(token) };
        callback(200, tokenInfo);
      } else {
        callback(404, { message: "token not available" });
      }
    });
  } else {
    callback(404, { message: "token not available" });
  }
};
// put method
handler._token.put = (requestProperties, callback) => {
  //   check the token is valid
  const tokenId =
    typeof requestProperties.body.tokenId === "string" ||
    requestProperties.body.tokenId.trim().length === 20
      ? requestProperties.body.tokenId
      : false;
  console.log("tokenId", tokenId);
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;

  if (tokenId && extend) {
    // check the token is available & not expired
    data.read("tokens", tokenId, (err, tokenInfo) => {
      if (!err && tokenInfo) {
        const tokenObject = { ...parseJSON(tokenInfo) };

        if (tokenObject.expires > Date.now()) {
          tokenObject.expires = Date.now() + 60 * 60 * 1000;
          // update token expiry
          data.update("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, { message: "token updated succeessfully" });
            } else {
              callback(500, { error: "server side error" });
            }
          });
        } else {
          callback(400, {
            message: "token already expired",
          });
        }
      } else {
        callback(404, { message: "There was a problem in your req!" });
      }
    });
  } else {
    callback(400, { error: "token dont exist" });
  }
};
// delete method
handler._token.delete = (requestProperties, callback) => {
  //   check the token  is valid
  const tokenId =
    typeof requestProperties.queryStringObject.tokenId === "string" &&
    requestProperties.queryStringObject.tokenId.trim().length === 20
      ? requestProperties.queryStringObject.tokenId
      : false;

  if (tokenId) {
    // look up the token
    data.read("tokens", tokenId, (err, tokenData) => {
      if (!err && tokenData) {
        // delete the token
        data.delete("tokens", tokenId, (err) => {
          if (!err) {
            callback(200, { message: "tokens deleted successfully" });
          } else {
            callback(500, { error: "server side problem to delete the token" });
          }
        });
      } else {
        callback(404, { message: "token not available" });
      }
    });
  } else {
    callback(405, { error: "Your request is not valid" });
  }
};

// token verifier
handler._token.verifyToken = (tokenId, phone, callback) => {
  // check token status
  data.read("tokens", tokenId, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
module.exports = handler;
