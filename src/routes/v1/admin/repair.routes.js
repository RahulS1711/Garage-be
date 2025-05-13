const express = require("express");
const RepairController = require("../../../controller/admin/repair.controller");
const {
  superAdminAuthenticate,
  adminAuthenticate,
} = require("../../../middleware/auth");
const router = express.Router();

router.get("/list", adminAuthenticate, RepairController.getRepair);
// router.get("/get/:id", RepairController.getBranchById);
router.post("/create", RepairController.createRepair);
router.put("/update/:id", adminAuthenticate, RepairController.updateRepair);
router.delete("/remove/:id", RepairController.deleteRepair);

module.exports = router;
