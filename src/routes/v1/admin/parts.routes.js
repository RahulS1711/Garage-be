const express = require("express");
const PartsController = require("../../../controller/admin/parts.controller");
const { uploadFile } = require("../../../services/multer");
const { adminAuthenticate } = require("../../../middleware/auth");
const router = express.Router();

router.get("/list", adminAuthenticate, PartsController.getPrats);
// router.get("/get/:id", PartsController.getBranchById);
router.post("/create", uploadFile, PartsController.create);
router.put("/update/:id", uploadFile, PartsController.updateParts);
router.delete("/remove/:id", PartsController.deleteParts);

module.exports = router;
