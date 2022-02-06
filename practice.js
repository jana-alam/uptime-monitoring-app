/*
    Title: Uplink Monitoring Application
    Description: Restful API to monitor up or down likn Application
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/
// dependencies
const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
// app object - module scaffolding

const app = {};

// configuration
app.config = {
  port: 3000,
};

// create server

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`listing on port: ${app.config.port}`);
  });
};

// Handle Request Response
app.handleReqRes = (req, res) => {
  // handle request
  const decoder = new StringDecoder("utf-8");
  const realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    // handle response
    res.end("Hello Practice");
  });
};

// start the server
app.createServer();
