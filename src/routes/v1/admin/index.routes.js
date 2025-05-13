const express = require("express");
const AuthRoutes = require("./auth.routes");
const BranchRoutes = require("./branch.routes");
const ServiceRoutes = require("./service.routes");
const StaffRoutes = require("./staff.routes");
const RepairRoutes = require("./repair.routes");
const CarTypeRoutes = require("./carType.routes");
const CarModelRoutes = require("./carModel.routes");
const CarBrandRoutes = require("./carBrand.routes");
const PartsRoutes = require("./parts.routes");
const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/branch", BranchRoutes);
router.use("/services", ServiceRoutes);
router.use("/staff", StaffRoutes);
router.use("/repair", RepairRoutes);
router.use("/car-type", CarTypeRoutes);
router.use("/car-model", CarModelRoutes);
router.use("/car-brand", CarBrandRoutes);
router.use("/car-brand", CarBrandRoutes);
router.use("/parts", PartsRoutes);

module.exports = router;
