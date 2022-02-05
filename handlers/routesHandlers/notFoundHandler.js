/*
    Title: Not found handler
    Description: 404 handler
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/
// handler object - module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, { message: "Requestd URL not found" });
};

module.exports = handler;
