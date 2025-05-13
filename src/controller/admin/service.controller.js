const deleteFile = require("../../common/deleteFile");
const ServiceModel = require("../../model/services.model");
const Yup = require("yup");
const { constant } = require("../../static/constant");

const serviceValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(0, "Price cannot be negative"),
  description: Yup.string().required("Description is required"),
  branch_id: Yup.string()
    .required("Branch ID is required")
    .length(24, "Branch ID must be 24 characters long"), // Assuming ObjectId length
});
const querySchema = Yup.object().shape({
  page: Yup.number().integer().min(1).default(1),
  limit: Yup.number().integer().min(1).max(100).default(10),
  sortBy: Yup.string()
    .oneOf(["branchName", "location", "createdAt"], "Invalid sort field")
    .default("createdAt"),
  sortOrder: Yup.string()
    .oneOf(["asc", "desc"], "Invalid sort order")
    .default("desc"),
  search: Yup.string().optional(),
});
const listServices = async (req, res) => {
  try {
    const validatedQuery = await querySchema.validate(req.query, {
      abortEarly: false,
    });
    const { page, limit, sortBy, sortOrder, search } = validatedQuery;

    let query = {
      isDeleted: false,
    };
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const branch_id = req.admin.branch_id;
    if (req.admin.role !== constant.ADMIN_ROLE.SUPERADMIN) {
      query = { branch_id: branch_id };
    }

    const totalService = await ServiceModel.countDocuments(query);
    const existingService = await ServiceModel.find()
      .populate("branch_id", "branchName _id")
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 }) // Sorting
      .skip((page - 1) * limit) // Pagination: Skip records
      .limit(limit);
    // Check if no services were found
    if (existingService.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    // Map the results to a more readable format
    const response = existingService.map(
      ({ _id, name, price, image, description, branch_id }) => ({
        _id,
        name,
        price,
        image,
        description,
        branchName: branch_id?.branchName,
        branchId: branch_id?._id,
      })
    );

    return res.status(200).json({
      message: "Services fetched successfully",
      data: response,
      pagination: {
        total: totalService,
        page,
        limit,
        totalPages: Math.ceil(totalService / limit),
      },
    });
  } catch (error) {
    console.error(error); // Use console.error for error logging
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || "An error occurred", // Simplified error message
    });
  }
};
const AddServices = async (req, res) => {
  try {
    await serviceValidationSchema.validate(req.body);

    const { name, price, description, branch_id } = req.body;
    const foundedName = await ServiceModel.findOne({ name: name });
    if (foundedName) {
      deleteFile(req.file.filename);
      return res.status(400).json({ message: "name already exist" });
    }
    if (!req.file) {
      deleteFile(req.file.filename);
      return res.status(400).json({ message: "please upload image" });
    }
    const addService = new ServiceModel({
      name,
      image: req.file.filename,
      price,
      description,
      branch_id,
    });
    await addService.save();

    return res.status(200).json({ message: "Service added successfully." });
  } catch (error) {
    deleteFile(req.file.filename);
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};
const updateServices = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const { name, price, description, branch_id } = req.body;

    const existingService = await ServiceModel.findById(id);
    if (!existingService) {
      return res.status(404).json({ message: "Service does not exist" });
    }

    // Prepare the update object
    const updateData = {
      name,
      price,
      description,
      branch_id,
    };

    // If a new file is uploaded, add it to the update data
    if (req.file) {
      updateData.image = req.file.filename;

      // If the service already has an image, delete the old file
      if (existingService.image) {
        deleteFile(existingService.image);
      }
    }

    // Update the service
    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || "An error occurred",
    });
  }
};

const deleteServices = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const foundedData = await ServiceModel.findOne({ _id: id });
    if (!foundedData) {
      return res.status(400).json({ message: "Services not exist" });
    }

    deleteFile(foundedData.image);

    foundedData.isDeleted = true;
    foundedData.DeleteAt = Date.now();
    await foundedData.save();

    return res.status(200).json({ message: "Service delete Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

module.exports = { AddServices, updateServices, deleteServices, listServices };
