/*
    Title: Uplink Monitoring Application
    Description: Restful API to monitor up or down likn Application
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/
// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");

//App object- module scaffolding
const app = {};
console.log(data.dirname);

// create server

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`listing to port ${environment.port}`);
  });
};

// handle request response

app.handleReqRes = handleReqRes;

// Invoke function
app.createServer();
