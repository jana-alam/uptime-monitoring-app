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

const routes = {
  sample: sampleHandler,
  notFound: notFoundHandler,
};

module.exports = routes;
