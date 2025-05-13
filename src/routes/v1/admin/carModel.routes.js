const express = require("express");
const CarModelController = require("../../../controller/admin/carmodel.controller");
const { uploadFile } = require("../../../services/multer");
const router = express.Router();

router.get("/list", CarModelController.listModel);
// router.get("/get/:id", CarModelController.getBranchById);
router.post("/create", uploadFile, CarModelController.createModel);
router.put("/update/:id", uploadFile, CarModelController.updateModel);
router.delete("/remove/:id", CarModelController.deleteModel);

module.exports = router;
