const BranchModel = require("../../model/branch.model");
const yup = require("yup");
const { constant } = require("../../static/constant");

const querySchema = yup.object().shape({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
  sortBy: yup
    .string()
    .oneOf(["branchName", "location", "createdAt"], "Invalid sort field")
    .default("createdAt"),
  sortOrder: yup
    .string()
    .oneOf(["asc", "desc"], "Invalid sort order")
    .default("desc"),
  search: yup.string().optional(),
});

const getBranch = async (req, res) => {
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

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { branchName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    let branchFilter = query;
    if (req.admin.role !== constant.ADMIN_ROLE.SUPERADMIN) {
      const branchId = Array.isArray(req.admin.branch_id)
        ? req.admin.branch_id
        : [req.admin.branch_id];
      branchFilter._id = { $in: branchId };
    }

    const totalBranch = await BranchModel.countDocuments(branchFilter);
    if (totalBranch === 0) {
      return res.status(404).json({ message: "No branch found" });
    }

    const findBasedOnBranch = await BranchModel.find(branchFilter)
      .select(
        "_id branchName location contactNumber email type pincode createdAt updatedAt"
      )
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const data = findBasedOnBranch.map((item) => ({
      _id: item._id,
      branchName: item.branchName,
      location: item.location,
      contactNumber: item.contactNumber,
      email: item.email,
      type: item.type,
      pincode: item.pincode,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return res.status(200).json({
      message: "Branches fetched successfully",
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

const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const getAllBranches = await BranchModel.findOne({ _id: id });
    if (!getAllBranches) {
      return res.status(400).json({ message: "no any branch found" });
    }
    return res.status(200).json({
      message: "branch fetched successfully",
      success: true,
      data: getAllBranches,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
const addBranch = async (req, res) => {
  try {
    const { branchName, location, contactNumber, email, type, pincode } =
      req.body;
    const findBranch = await BranchModel.findOne({ branchName: branchName });
    if (findBranch) {
      return res.status(400).json({ message: "Branch name already exist" });
    }

    const addBranch = new BranchModel({
      branchName,
      location,
      contactNumber,
      email,
      type,
      pincode,
    });

    const addedBranch = await addBranch.save();
    let data = {
      _id: addedBranch._id,
      branchName: addedBranch.branchName,
      location: addedBranch.location,
      contactNumber: addedBranch.contactNumber,
      email: addedBranch.email,
      type: addedBranch.type,
      createAt: addedBranch.createdAt,
      updatedAt: addedBranch.updatedAt,
    };

    return res.status(200).json({ message: "Branch added successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchName, location, contactNumber, email, type, pincode } =
      req.body;
    const getBranch = BranchModel.findOne({ _id: id });
    if (!getBranch) {
      return res
        .status(400)
        .json({ message: `not found any branch on this ${id} id` });
    }
    const updatedBranch = await BranchModel.findByIdAndUpdate(
      { _id: id },
      { branchName, location, contactNumber, email, type, pincode },
      { new: true }
    );

    let data = {
      _id: updatedBranch._id,
      branchName: updatedBranch.branchName,
      location: updatedBranch.location,
      contactNumber: updatedBranch.contactNumber,
      email: updatedBranch.email,
      type: updatedBranch.type,
      pincode: updatedBranch.pincode,
      createAt: updatedBranch.createdAt,
      updatedAt: updatedBranch.updatedAt,
    };

    return res
      .status(200)
      .json({ message: "branch update successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteData = await BranchModel.findOne({ _id: id });

    if (!deleteData) {
      return res
        .status(400)
        .json({ message: `branch not found on this ${id} id` });
    }
    deleteData.isDeleted = true;
    deleteData.deletedAt = Date.now();

    await deleteData.save();

    res.status(200).json({ message: "branch deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  getBranch,
  addBranch,
  updateBranch,
  deleteBranch,
  getBranchById,
};
