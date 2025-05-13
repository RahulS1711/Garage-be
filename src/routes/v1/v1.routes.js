const express = require("express"); // import the express module
const router = express.Router();
const AdminRoutes = require("./admin/index.routes");
const UserRoutes = require("./users/index.routes");

router.use("/admin", AdminRoutes);
router.use("/users", UserRoutes);

module.exports = router;
