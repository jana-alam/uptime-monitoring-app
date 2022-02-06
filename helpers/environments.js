/*
    Title: Environmnet variable
    Description: Environment variable
    Author: Md Jana Alam
    Date: 05 Feb 2022
*/

// module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "hello",
};
environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "world",
};

// determine which enviroment was passed

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding enviorment object

const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module

module.exports = environmentToExport;
