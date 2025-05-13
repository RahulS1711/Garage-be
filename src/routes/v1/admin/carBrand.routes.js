const express = require("express");
const CarBrandController = require("../../../controller/admin/carBrand.controller");
const { uploadFile } = require("../../../services/multer");
const router = express.Router();

router.get("/list", CarBrandController.listBrand);
// router.get("/get/:id", CarBrandController.getBranchById);
router.post("/create", uploadFile, CarBrandController.createBrand);
router.put("/update/:id", uploadFile, CarBrandController.updateBrand);
router.delete("/remove/:id", CarBrandController.deleteBrand);

module.exports = router;
