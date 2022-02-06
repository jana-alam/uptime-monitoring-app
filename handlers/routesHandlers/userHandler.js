/*
    Title: User handler
    Description: handle user route
    Author: Md Jana Alam
    Date: 06 Feb 2022
*/

// dependencies
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilities");
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

// to handle diffrent method of user api
// _usrer scaffoldling
handler._user = {};

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
    callback(404, { message: "user not available" });
  }
};

module.exports = handler;
