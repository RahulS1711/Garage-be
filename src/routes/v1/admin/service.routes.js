const express = require("express");
const ServiceController = require("../../../controller/admin/service.controller");
const { uploadFile } = require("../../../services/multer");
const { adminAuthenticate } = require("../../../middleware/auth");
const routes = express.Router();
routes.get("/list", adminAuthenticate, ServiceController.listServices);
routes.post(
  "/create",
  adminAuthenticate,
  uploadFile,
  ServiceController.AddServices
);
routes.put(
  "/update/:id",
  adminAuthenticate,
  uploadFile,
  ServiceController.updateServices
);
routes.delete(
  "/remove/:id",
  adminAuthenticate,
  ServiceController.deleteServices
);
module.exports = routes;
