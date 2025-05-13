const express = require("express");
const StaffController = require("../../../controller/admin/staff.controller");
const { adminAuthenticate } = require("../../../middleware/auth");
const routes = express.Router();

routes.get("/list", adminAuthenticate, StaffController.list);
routes.post("/create", StaffController.create);
routes.put("/update/:id", StaffController.update);
routes.delete("/remove/:id", StaffController.remove);

module.exports = routes;
