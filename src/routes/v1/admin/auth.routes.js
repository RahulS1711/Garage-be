const express = require("express");
const AuthController = require("../../../controller/admin/authAdmin.controller");
const { superAdminAuthenticate } = require("../../../middleware/auth");
const routes = express.Router();

routes.get("/list", superAdminAuthenticate, AuthController.adminList);
routes.get("/list/:id", superAdminAuthenticate, AuthController.adminListById);
routes.post("/signin", AuthController.login);
routes.post("/cerate", AuthController.createUser);
routes.post("/update/:id", superAdminAuthenticate, AuthController.updateAdmin);
routes.delete(
  "/remove/:id",
  superAdminAuthenticate,
  AuthController.deleteAdmin
);

module.exports = routes;
