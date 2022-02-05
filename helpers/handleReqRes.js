/*
    Title: handle request response
    Description: handle request response
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/

// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");

// Handler object - Module Scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // handle requrst
  //   parsed url and get url infos
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const headersObject = req.headers;
  const queryStringObject = parsedUrl.query;

  // reques properties
  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    headersObject,
    queryStringObject,
  };

  const choosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : routes.notFound;
  // invoke route handler function
  choosenHandler(requestProperties, (statusCode, payload) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};
    const payloadString = JSON.stringify(payload);
    // rerurn the final response
    res.writeHead(statusCode);
    res.end(payloadString);
  });

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    // handle response
    res.end("hello world changes");
  });
};

module.exports = handler;
