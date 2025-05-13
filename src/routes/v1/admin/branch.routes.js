const express = require("express");
const VehicleController = require("../../../controller/admin/branch.controller");
const {
  adminAuthenticate,
  superAdminAuthenticate,
} = require("../../../middleware/auth");
const router = express.Router();

router.get("/getAll", adminAuthenticate, VehicleController.getBranch);
router.get("/get/:id", adminAuthenticate, VehicleController.getBranchById);
router.post("/create", adminAuthenticate, VehicleController.addBranch);
router.post("/update/:id", adminAuthenticate, VehicleController.updateBranch);
router.delete("/remove/:id", adminAuthenticate, VehicleController.deleteBranch);

module.exports = router;
