/*
    Title: sample handler
    Description: handle sample route
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/
// handler object - module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  callback(200, {
    message: requestProperties,
  });
};

module.exports = handler;
