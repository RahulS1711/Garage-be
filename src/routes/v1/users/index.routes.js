const express = require("express");
const AuthRoutes = require("./auth.routes");
const VehicleRoutes = require("./vehicleDetails.routes");
const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/vehicle", VehicleRoutes);
module.exports = router;
