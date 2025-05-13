const { findByIdAndUpdate } = require("../../model/admin.model");
const StaffModel = require("../../model/staff.model");
const yup = require("yup");
const { constant } = require("../../static/constant");

const staffValidationSchema = yup.object().shape({
  branchID: yup.string().required("Branch ID is required"),
  name: yup.string().trim().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  contactNumber: yup
    .string()
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),
  role: yup
    .string()
    .oneOf(["technician", "manager", "admin"], "Invalid role")
    .required("Role is required"),
  skills: yup.array().of(yup.string()).default([]),
  //   assignedRepairs: yup.array().of(yup.string()).default([]), // Assuming repair IDs are strings (MongoDB ObjectId)
  hireDate: yup.date().default(() => new Date()),
  salary: yup
    .number()
    .positive("Salary must be a positive number")
    .required("Salary is required"),
  status: yup
    .string()
    .oneOf(["active", "inactive"], "Invalid status")
    .default("Active"),
  notes: yup.string().nullable(),
});

const list = async (req, res) => {
  try {
    let branchFilter = {};
    if (req.admin.role !== constant.ADMIN_ROLE.SUPERADMIN) {
      const branchId = Array.isArray(req.admin.branch_id)
        ? req.admin.branch_id
        : [req.admin.branch_id];

      branchFilter.branchID = { $in: branchId };
    }
    console.log(branchFilter);
    const existingStaff = await StaffModel.find(branchFilter).populate(
      "branchID",
      "branchName _id"
    );
    if (!existingStaff) {
      return res.status(404).json({ message: "staff not found" });
    }

    console.log(existingStaff);
    const response = existingStaff.map(
      ({
        _id,
        branchID,
        name,
        email,
        contactNumber,
        role,
        skills,
        assignedRepairs,
        hireDate,
        salary,
        status,
        notes,
      }) => ({
        _id,
        name,
        email,
        contactNumber,
        role,
        skills,
        assignedRepairs,
        hireDate,
        salary,
        status,
        notes,
        branchName: branchID?.branchName,
        branchId: branchID?._id,
      })
    );

    return res
      .status(200)
      .json({ message: "record fetch successfully", data: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};
const create = async (req, res) => {
  try {
    await staffValidationSchema.validate(req.body);
    const {
      branchID,
      name,
      email,
      contactNumber,
      role,
      skills,
      assignedRepairs,
      hireDate,
      salary,
      status,
      notes,
    } = req.body;

    const existingData = await StaffModel.findOne({ email: email });
    if (existingData) {
      return res.status(400).json({ message: "email already exist" });
    }

    const addStaff = new StaffModel({
      branchID,
      name,
      email,
      contactNumber,
      role,
      skills,
      assignedRepairs,
      hireDate,
      salary,
      status,
      notes,
    });
    let response = await addStaff.save();

    return res
      .status(200)
      .json({ message: "staff added successfully", data: response });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingStaff = await StaffModel.findById(id);
    if (!existingStaff) {
      return res.status(404).json({ message: "Record not found for this ID" });
    }

    const updatedStaff = await StaffModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Ensures validation rules are applied
    });

    return res
      .status(200)
      .json({ message: "Staff updated successfully", data: updatedStaff });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existingStaff = await StaffModel.findById(id);
    if (!existingStaff) {
      return res.status(404).json({ message: "Record not found for this ID" });
    }
    existingStaff.isDeleted = true;
    existingStaff.deletedAt = Date.now();

    await existingStaff.save();

    return res
      .status(200)
      .json({ message: "staff record delete successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

module.exports = { list, create, update, remove };
