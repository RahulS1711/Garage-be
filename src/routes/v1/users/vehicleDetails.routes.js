const express = require("express");
const VehicleDetailsController = require("../../../controller/users/vehicleDetails.controller");
const router = express.Router();

router.post("/create-details", VehicleDetailsController.addDetails);
router.put("/update-details/:id", VehicleDetailsController.updateDetails);
router.delete("/delete-details/:id", VehicleDetailsController.removeDetails);

module.exports = router;
