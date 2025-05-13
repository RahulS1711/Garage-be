const express = require("express");
const CarTypeController = require("../../../controller/admin/carType.controller");
const { uploadFile } = require("../../../services/multer");
const router = express.Router();

router.get("/list", CarTypeController.listType);
// router.get("/get/:id", CarTypeController.getBranchById);
router.post("/create", uploadFile, CarTypeController.createType);
router.put("/update/:id", uploadFile, CarTypeController.updateType);
router.delete("/remove/:id", CarTypeController.deleteType);

module.exports = router;
