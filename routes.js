/*
    Title: routes
    Description: routes
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/

// dependencies
const {
  notFoundHandler,
} = require("./handlers/routesHandlers/notFoundHandler");
const { sampleHandler } = require("./handlers/routesHandlers/sampleHandler");
const { tokenHandler } = require("./handlers/routesHandlers/tokenHandler");
const { userHandler } = require("./handlers/routesHandlers/userHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  notFound: notFoundHandler,
};

module.exports = routes;
