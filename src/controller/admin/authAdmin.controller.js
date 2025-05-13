const AdminModel = require("../../model/admin.model");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const Yup = require("yup");
const { signJwtToken } = require("../../utils/common");

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),

  email: Yup.string().required("Email is required").email("Email is not valid"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character"),

  role: Yup.string()
    .required("Role is required")
    .oneOf(
      ["admin", "superadmin"],
      "Role must be one of the following: admin, superadmin"
    ),

  status: Yup.string()
    .required("Status is required")
    .oneOf(["active", "inactive"], "Status must be either active or inactive"),
});
const adminList = async (req, res) => {
  try {
    let foundedAdmin = await AdminModel.find({ role: { $ne: "superadmin" } });
    if (foundedAdmin && foundedAdmin.length <= 0) {
      return res.status(400).json({ message: "no record found" });
    }
    return res
      .status(200)
      .json({ message: "record fetch successfully", data: foundedAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};

const adminListById = async (req, res) => {
  try {
    const { id } = req.params;
    let foundedAdmin = await AdminModel.findOne({ _id: id });

    if (!foundedAdmin) {
      return res.status(400).json({ message: "no record found" });
    }
    return res
      .status(200)
      .json({ message: "record fetch successfully", data: foundedAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};

const createUser = async (req, res) => {
  try {
    await validationSchema.validate(req.body);
    const { branch_id, name, email, phone, password, role, status } = req.body;

    const foundedAdmin = await AdminModel.findOne({ email: email });
    if (foundedAdmin) {
      return res.status(400).json({ message: "email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const AdminUser = new AdminModel({
      branch_id,
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      status,
    });

    let newAdmin = await AdminUser.save();
    return res
      .status(200)
      .json({ message: "admin user created successfully", data: newAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let foundedEmail = await AdminModel.findOne({ email: email });
    if (!foundedEmail) {
      return res.status(200).json({ message: "email not found " });
    }
    let comparePassword = await bcrypt.compare(password, foundedEmail.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ message: "email and password is incorrect" });
    }

    const token = signJwtToken({ _id: foundedEmail._id });
    const response = {
      user: {
        _id: foundedEmail._id,
        name: foundedEmail.name,
        email: foundedEmail.email,
        phone: foundedEmail.phone,
        role: foundedEmail.role,
        status: foundedEmail.status,
        createdAt: foundedEmail.createdAt,
        updatedAt: foundedEmail.updatedAt,
      },
      token: token,
    };
    return res
      .status(200)
      .json({ status: 200, message: "Admin Signin successfully", response });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch_id, name, email, phone, password, role, status } = req.body;
    const FoundedAdmin = await AdminModel.findOne({ _id: id });
    if (!FoundedAdmin) {
      return res.status(200).json({ message: "admin not found on this id" });
    }

    let updatedAdmin = await AdminModel.findByIdAndUpdate(
      { _id: id },
      { branch_id, name, email, phone, password, role, status },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Admin update successfully", data: updatedAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const FoundedAdmin = await AdminModel.findOne({ _id: id });
    if (!FoundedAdmin) {
      return res.status(200).json({ message: "admin not found on this id" });
    }

    FoundedAdmin.isDeleted = true;
    FoundedAdmin.deletedAt = Date.now();

    await FoundedAdmin.save();

    return res.status(200).json({ message: "Admin delete successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};

module.exports = {
  createUser,
  login,
  updateAdmin,
  deleteAdmin,
  adminList,
  adminListById,
};
