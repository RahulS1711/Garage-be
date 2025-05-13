const UserModel = require("../model/user.model");
const AdminModel = require("../model/admin.model");
const { constant } = require("../static/constant");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  let token;

  const authHeader = req.headers["authorization"];

  // Check if the Authorization header is present and if it starts with "Bearer "
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // If no token is found , return a 401 error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No valid token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has not expired
    // if (decoded.exp < Date.now() / 1000) {
    //   return res.status(401).json({ message: "Unauthorized - Token expired" });
    // }

    const user = await UserModel.findOne({ _id: decoded._id });
    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};
const adminAuthenticate = async (req, res, next) => {
  let token;

  const authHeader = req.headers["authorization"];

  // Check if the Authorization header is present and if it starts with "Bearer "
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // If no token is found , return a 401 error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No valid token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has not expired
    // if (decoded.exp < Date.now() / 1000) {
    //   return res.status(401).json({ message: "Unauthorized - Token expired" });
    // }

    if (!decoded) {
      return res.status(401).json({ message: "token is not matched " });
    }

    const adminUser = await AdminModel.findOne({ _id: decoded._id });
    if (!adminUser) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    req.admin = adminUser;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};
const superAdminAuthenticate = async (req, res, next) => {
  let token;

  const authHeader = req.headers["authorization"];

  // Check if the Authorization header is present and if it starts with "Bearer "
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // If no token is found , return a 401 error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No valid token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has not expired
    // if (decoded.exp < Date.now() / 1000) {
    //   return res.status(401).json({ message: "Unauthorized - Token expired" });
    // }

    if (!decoded) {
      return res.status(401).json({ message: "token is not matched " });
    }

    const adminUser = await AdminModel.findOne({ _id: decoded._id });

    if (!adminUser) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    if (adminUser.role !== constant.ADMIN_ROLE.SUPERADMIN) {
      return res.status(401).json({ message: "This is not superadmin " });
    }

    req.admin = adminUser;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};
module.exports = { authenticate, adminAuthenticate, superAdminAuthenticate };
