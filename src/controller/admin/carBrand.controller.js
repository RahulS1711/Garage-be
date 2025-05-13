const deleteFile = require("../../common/deleteFile");
const CarBrandModel = require("../../model/carBrand.model");

const listBrand = async (req, res) => {
  try {
    const existingService = await CarBrandModel.find();
    // Check if no services were found
    if (existingService.length === 0) {
      return res.status(400).json({ message: "No car brand found" });
    }

    // Map the results to a more readable format
    const response = existingService.map(
      ({ _id, brandName, carModel, icon }) => ({
        _id,
        icon,
        brandName,
        carModel,
      })
    );

    return res.status(200).json({
      message: "Services fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error(error); // Use console.error for error logging
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || "An error occurred", // Simplified error message
    });
  }
};
const createBrand = async (req, res) => {
  try {
    const { brandName, carModel } = req.body;
    console.log("req.body", req.body);
    const exitingCarBrand = await CarBrandModel.findOne({
      brandName: brandName,
    });

    if (exitingCarBrand) {
      deleteFile(req.file.filename);
      return res.status(200).json({ message: "Car brand already exist" });
    }
    if (!req.file) {
      return res.status(200).json({ message: "file is required.." });
    }
    const newBrand = new CarBrandModel({
      brandName,
      carModel,
      icon: req.file.filename,
    });

    await newBrand.save();
    return res.status(200).json({ message: "Car Brand Added Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const updateBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const { brandName, carModel } = req.body;
    const exitingCarBrand = await CarBrandModel.findById(id);

    if (!exitingCarBrand) {
      return res.status(200).json({ message: "Car type no exist" });
    }
    const updateData = {
      brandName,
      carModel,
    };
    if (req.file) {
      updateData.icon = req.file.filename;

      // If the service already has an image, delete the old file
      if (exitingCarBrand.icon) {
        deleteFile(existingService.icon);
      }
    }

    const updatedService = await CarBrandModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "CarBrand updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const foundedData = await CarBrandModel.findById(id);
    if (!foundedData) {
      return res.status(400).json({ message: "CarType not exist" });
    }

    deleteFile(foundedData.icon);

    foundedData.isDeleted = true;
    foundedData.deletedAt = Date.now();

    await foundedData.save();

    return res.status(200).json({ message: "CarType delete Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

module.exports = { createBrand, updateBrand, deleteBrand, listBrand };
