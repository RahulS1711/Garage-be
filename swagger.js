const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Garage API",
    description: "It's backend for an online Garage application.",
  },
  host: "localhost:1234",
};

const outputFile = "./swagger.json";
const routes = ["./src/app.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
