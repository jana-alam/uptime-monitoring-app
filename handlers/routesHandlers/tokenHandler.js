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
  //   check the phone number is valid
  const tokenId =
    typeof requestProperties.queryStringObject.tokenId === "string" ||
    requestProperties.queryStringObject.tokenId.trim().length === 20
      ? requestProperties.queryStringObject.tokenId
      : false;
  console.log(tokenId);

  if (tokenId) {
    // look up the user
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
  //   check the phone number is valid
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length >= 6
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      // check the phone number is available
      data.read("users", phone, (err, userData) => {
        if (!err && userData) {
          const updatedUser = { ...parseJSON(userData) };
          if (firstName) {
            updatedUser.firstName = firstName;
          }
          if (lastName) {
            updatedUser.lastName = lastName;
          }
          if (password) {
            updatedUser.password = hash(password);
          }

          // update user info
          data.update("users", phone, updatedUser, (err) => {
            if (!err) {
              callback(200, { message: "user updated succeessfully" });
            } else {
              callback(500, { error: "server side error" });
            }
          });
        } else {
          callback(404, { message: "User not found!" });
        }
      });
    } else {
      callback(400, { error: "nothing received to update" });
    }
  } else {
    callback(400, { error: "Phone number is not valid" });
  }
};
// delete method
handler._token.delete = (requestProperties, callback) => {
  //   check the phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // look up the user
    data.read("users", phone, (err, user) => {
      if (!err && user) {
        // delete the user
        data.delete("users", phone, (err) => {
          if (!err) {
            callback(200, { message: "user deleted successfully" });
          } else {
            callback(500, { error: "server side problem to delete the user" });
          }
        });
      } else {
        callback(404, { message: "user not available" });
      }
    });
  } else {
    callback(405, { error: "Your request is not valid" });
  }
};

module.exports = handler;
