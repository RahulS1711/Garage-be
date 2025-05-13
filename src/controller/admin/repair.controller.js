const { response } = require("express");
const RepairModel = require("../../model/repair.model");
const yup = require("yup");
const { constant } = require("../../static/constant");
const repairValidationSchema = yup.object().shape({
  branchID: yup.string().required("Branch ID is required"), // ObjectId as a string
  serviceID: yup.string().required("Service ID is required"),
  employeeID: yup.string().required("Employee ID is required"),
  customerName: yup.string().trim().required("Customer name is required"),
  contactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Contact number must be numeric")
    .required("Contact number is required"),
  issueDescription: yup.string().required("Issue description is required"),
  status: yup
    .string()
    .oneOf(
      ["Pending", "In Progress", "Completed", "Cancelled"],
      "Invalid status"
    )
    .default("Pending"),
  assignedDate: yup.date().default(() => new Date()),
  completionDate: yup.date().nullable(),
  costEstimate: yup.number().required("Cost estimate is required"),
  actualCost: yup.number().nullable(),
  notes: yup.string().nullable(),
});

// pagination yup schema
const queryValidationSchema = yup.object().shape({
  page: yup
    .number()
    .integer()
    .min(1)
    .default(1)
    .required("Page must be a positive integer"),
  limit: yup
    .number()
    .integer()
    .min(1)
    .default(10)
    .required("Limit must be a positive integer"),
  search: yup.string().optional(),
  sortBy: yup
    .string()
    .oneOf(
      ["assignedDate", "customerName", "status", "completionDate"],
      "Invalid sort field"
    )
    .default("assignedDate"),
  order: yup
    .string()
    .oneOf(["asc", "desc"], "Order must be 'asc' or 'desc'")
    .default("desc"),
});

const getRepair = async (req, res) => {
  try {
    // Validate query parameters using Yup
    const validatedQuery = await queryValidationSchema.validate(req.query, {
      abortEarly: false,
    });

    let { page, limit, search, sortBy, order } = validatedQuery;

    // Search filter (if search term is provided)
    let searchFilter = search
      ? {
          $or: [
            { customerName: { $regex: search, $options: "i" } },
            { contactNumber: { $regex: search, $options: "i" } },
            { issueDescription: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const branch_id = req.admin.branch_id;
    if (req.admin.role !== constant.ADMIN_ROLE.SUPERADMIN) {
      searchFilter = { branchID: branch_id };
    }

    console.log(searchFilter);
    // Sort order (asc or desc)
    const sortOrder = order === "asc" ? 1 : -1;

    // Fetch data with pagination, search, and sorting
    const getRepairData = await RepairModel.find(searchFilter)
      .populate("branchID", "branchName")
      .populate("serviceID", "name")
      .populate("employeeID", "name")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    let data = getRepairData.map((item) => ({
      _id: item._id,
      branchID: item.branchID._id,
      branchName: item.branchID.branchName,
      serviceID: item.serviceID._id,
      serviceName: item.serviceID.name,
      employeeID: item.employeeID._id,
      employeeName: item.employeeID.name,
      customerName: item.customerName,
      contactNumber: item.contactNumber,
      issueDescription: item.issueDescription,
      status: item.status,
      assignedDate: item.assignedDate,
      completionDate: item.completionDate,
      costEstimate: item.costEstimate,
      actualCost: item.actualCost,
      notes: item.notes,
    }));

    // Count total records
    const totalRecords = await RepairModel.countDocuments(searchFilter);

    return res.status(200).json({
      success: true,
      message: "Repairs fetched successfully",
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      data,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const createRepair = async (req, res) => {
  try {
    // Destructure request body
    const repairData = req.body;

    // Validate request body using Yup
    await repairValidationSchema.validate(repairData, { abortEarly: false });

    // Create and save repair record in one step
    const newRepair = await RepairModel.create(repairData);

    // Send response with only necessary fields
    return res.status(201).json({
      message: "Repair added successfully",
      data: {
        _id: newRepair._id,
        branchID: newRepair.branchID,
        serviceID: newRepair.serviceID,
        employeeID: newRepair.employeeID,
        customerName: newRepair.customerName,
        contactNumber: newRepair.contactNumber,
        issueDescription: newRepair.issueDescription,
        status: newRepair.status,
        assignedDate: newRepair.assignedDate,
        completionDate: newRepair.completionDate,
        costEstimate: newRepair.costEstimate,
        actualCost: newRepair.actualCost,
        notes: newRepair.notes,
      },
    });
  } catch (error) {
    return res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.name === "ValidationError" ? error.errors : "Server Error",
    });
  }
};

const updateRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      branchID,
      serviceID,
      employeeID,
      customerName,
      contactNumber,
      issueDescription,
      status,
      assignedDate,
      completionDate,
      costEstimate,
      actualCost,
      notes,
    } = req.body;
    const existingRepair = await RepairModel.findById(id);
    if (!existingRepair) {
      return res
        .status(400)
        .json({ message: "not found repair system in this id " });
    }
    const updateRepair = await RepairModel.findByIdAndUpdate(
      { _id: id },
      {
        branchID,
        serviceID,
        employeeID,
        customerName,
        contactNumber,
        issueDescription,
        status,
        assignedDate,
        completionDate,
        costEstimate,
        actualCost,
        notes,
      },
      { new: true }
    );
    let data = {
      _id: updateRepair._id,
      branchID: updateRepair.branchID,
      serviceID: updateRepair.serviceID,
      employeeID: updateRepair.employeeID,
      customerName: updateRepair.customerName,
      contactNumber: updateRepair.contactNumber,
      issueDescription: updateRepair.issueDescription,
      status: updateRepair.status,
      assignedDate: updateRepair.assignedDate,
      completionDate: updateRepair.completionDate,
      costEstimate: updateRepair.costEstimate,
      actualCost: updateRepair.actualCost,
      notes: updateRepair.notes,
    };
    return res
      .status(200)
      .json({ message: "Repair data update successfully", data });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const deleteRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRepair = await RepairModel.findById(id);
    if (!existingRepair) {
      return res
        .status(400)
        .json({ message: "not found repair system in this id " });
    }

    existingRepair.isDeleted = true;
    existingRepair.deletedAt = Date.now();

    await existingRepair.save();
    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

module.exports = { createRepair, getRepair, updateRepair, deleteRepair };
