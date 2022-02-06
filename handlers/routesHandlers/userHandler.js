/*
    Title: User handler
    Description: handle user route
    Author: Md Jana Alam
    Date: 06 Feb 2022
*/

// dependencies
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
// handler object - module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "You are not allowed",
    });
  }
};

// _usrer scaffoldling
handler._user = {};
// to handle diffrent method of user api

// post method
handler._user.post = (requestProperties, callback) => {
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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  //   check all fields are available
  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure user does not exist
    data.read("users", phone, (err) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // create new user
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, { message: "user was created successfully" });
          } else {
            callback(500, { error: "user couldnt create" });
          }
        });
      } else {
        callback(500, { message: "User already exists" });
      }
    });
  } else {
    callback(400, {
      error: userObject,
    });
  }
};
// get method
handler._user.get = (requestProperties, callback) => {
  //   check the phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    //   verify user token
    let tokenId =
      typeof requestProperties.headersObject.tokenid === "string" &&
      requestProperties.headersObject.tokenid.trim().length === 20
        ? requestProperties.headersObject.tokenid
        : false;

    tokenHandler._token.verifyToken(tokenId, phone, (result) => {
      if (result) {
        // look up the user
        data.read("users", phone, (err, u) => {
          if (!err && u) {
            const user = { ...parseJSON(u) };
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { message: "usersss not available" });
          }
        });
      } else {
        callback(403, { error: "Authentication failure!" });
      }
    });
  } else {
    callback(404, { message: "user not available" });
  }
};
// put method
handler._user.put = (requestProperties, callback) => {
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
    //   verify user token
    let tokenId =
      typeof requestProperties.headersObject.tokenid === "string" &&
      requestProperties.headersObject.tokenid.trim().length === 20
        ? requestProperties.headersObject.tokenid
        : false;

    tokenHandler._token.verifyToken(tokenId, phone, (result) => {
      if (result) {
        // look up the user
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
        callback(403, { error: "Authentication failure!" });
      }
    });
  } else {
    callback(400, { error: "Phone number is not valid" });
  }
};
// delete method
handler._user.delete = (requestProperties, callback) => {
  //   check the phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    //   verify user token
    let tokenId =
      typeof requestProperties.headersObject.tokenid === "string" &&
      requestProperties.headersObject.tokenid.trim().length === 20
        ? requestProperties.headersObject.tokenid
        : false;

    tokenHandler._token.verifyToken(tokenId, phone, (result) => {
      if (result) {
        // look up the user
        data.read("users", phone, (err, user) => {
          if (!err && user) {
            // delete the user
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, { message: "user deleted successfully" });
              } else {
                callback(500, {
                  error: "server side problem to delete the user",
                });
              }
            });
          } else {
            callback(404, { message: "user not available" });
          }
        });
      } else {
        callback(403, { error: "Authentication failure!" });
      }
    });
  } else {
    callback(405, { error: "Your request is not valid" });
  }
};

module.exports = handler;
