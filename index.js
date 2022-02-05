/*
    Title: Uplink Monitoring Application
    Description: Restful API to monitor up or down likn Application
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/
// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

//App object- module scaffolding
const app = {};

// configuration

app.config = {
  port: 3000,
};

// create server

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`listing to port ${app.config.port}`);
  });
};

// handle request response

app.handleReqRes = handleReqRes;

// Invoke function
app.createServer();
