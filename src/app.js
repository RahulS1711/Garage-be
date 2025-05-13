const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
let logger = require("morgan");
const cors = require("cors");
const AppRoutes = require("./routes/index");
const PORT = process.env.PORT || 1000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const { MONGO_URI } = process.env;
const path = require("path");

app.use("/uploads", express.static("../uploads"));
app.use(express.static(path.join(__dirname, "../uploads")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Serve Swagger documentation
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL })
);

app.use("/api", AppRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Garage Application");
});

app.listen(PORT, () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("DB Connected");
      console.log(`Server is running on port ${PORT}`);
    })
    .catch((err) => {
      console.log("Error in DB Connection", err);
    });
});
