const PartsModel = require("../../model/parts.model");
const yup = require("yup");
const { constant } = require("../../static/constant");
const deleteFile = require("../../common/deleteFile");
const partSchema = yup.object().shape({
  branch_id: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")
    .required("Branch ID is required"),

  //   image: yup.string().required("Image is required"),

  name: yup.string().trim().required("Name is required"),

  location: yup.string().trim().required("Location is required"),

  quantity: yup
    .number()
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),

  status: yup
    .string()
    .oneOf(["available", "notavailable"], "Invalid status")
    .default("available"),

  description: yup.string().trim().required("Description is required"),

  lastUpdated: yup.date().nullable(),
});

const querySchema = yup.object().shape({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
  sortBy: yup
    .string()
    .oneOf(["name", "location", "createdAt"], "Invalid sort field")
    .default("createdAt"),
  sortOrder: yup
    .string()
    .oneOf(["asc", "desc"], "Invalid sort order")
    .default("desc"),
  search: yup.string().optional(),
});

const getPrats = async (req, res) => {
  try {
    const validatedQuery = await querySchema.validate(req.query, {
      abortEarly: false,
    });
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
      search,
    } = validatedQuery;

    page = parseInt(page);
    limit = parseInt(limit);

    let query;

    const branch_id = req.admin.branch_id;
    if (req.admin.role !== constant.ADMIN_ROLE.SUPERADMIN) {
      query = { branch_id: branch_id };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    const totalBranch = await PartsModel.countDocuments(query);

    const findBasedOnBranch = await PartsModel.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const data = findBasedOnBranch.map((item) => ({
      _id: item._id,
      branch_id: item.branch_id,
      name: item.name,
      location: item.location,
      quantity: item.quantity,
      image: item.image,
      status: item.status,
      description: item.description,
      lastUpdated: item.lastUpdated,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return res.status(200).json({
      message: "parts fetched successfully",
      success: true,
      data,
      pagination: {
        total: totalBranch,
        page,
        limit,
        totalPages: Math.ceil(totalBranch / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req, res) => {
  try {
    console.log("req.body===>", req.body);
    await partSchema.validate(req.body);
    const {
      branch_id,
      name,
      location,
      quantity,
      status,
      description,
      lastUpdated,
    } = req.body;

    const existParts = await PartsModel.findOne({ name: name });
    if (existParts) {
      deleteFile(exitingModel.image);

      return res.status(400).json({ message: "parts name already exist" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "parts image is required" });
    }
    const newParts = new PartsModel({
      branch_id,
      name,
      location,
      quantity,
      image: req.file.filename,
      status,
      description,
      lastUpdated,
    });

    let response = await newParts.save();

    return res
      .status(200)
      .json({ message: "Parts added successfully", data: response });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const updateParts = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      branch_id,
      name,
      location,
      quantity,
      status,
      description,
      lastUpdated,
    } = req.body;

    const existParts = await PartsModel.findById(id);
    if (!existParts) {
      return res.status(400).json({ message: "no parts exist for this id" });
    }

    const updateData = {
      branch_id,
      name,
      location,
      quantity,
      status,
      description,
      lastUpdated,
    };

    if (req.file) {
      updateData.image = req.file.filename;
      if (exitingModel.icon) {
        deleteFile(exitingModel.image);
      }
    }

    const updatedParts = await PartsModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    const response = {
      _id: updatedParts._id,
      branch_id: updatedParts.branch_id,
      name: updatedParts.name,
      location: updatedParts.location,
      quantity: updatedParts.quantity,
      image: updatedParts.image,
      status: updatedParts.status,
      description: updatedParts.description,
      lastUpdated: updatedParts.lastUpdated,
      createdAt: updatedParts.createdAt,
      updatedAt: updatedParts.updatedAt,
    };

    return res
      .status(200)
      .json({ message: "Parts update successfully", data: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const deleteParts = async (req, res) => {
  try {
    const { id } = req.params;
    const existParts = await PartsModel.findById(id);
    if (!existParts) {
      return res.status(400).json({ message: "no parts exist for this id" });
    }

    existParts.isDelete = true;
    existParts.deletedAt = Date.now();

    await existParts.save();

    return res.status(200).json({ message: "Parts delete successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};
module.exports = { create, getPrats, updateParts, deleteParts };
