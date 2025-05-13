const deleteFile = require("../../common/deleteFile");
const CarTypeModel = require("../../model/carType.model");

const listType = async (req, res) => {
  try {
    const existingService = await CarTypeModel.find();

    // Check if no services were found
    if (existingService.length === 0) {
      return res.status(404).json({ message: "No car type found" });
    }

    // Map the results to a more readable format
    const response = existingService.map(({ _id, icon, carFuelTypeName }) => ({
      _id,
      icon,
      carFuelTypeName,
    }));

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
const createType = async (req, res) => {
  try {
    const { carFuelTypeName } = req.body;
    const exitingCarTpe = await CarTypeModel.findOne({
      carFuelTypeName: carFuelTypeName,
    });

    if (exitingCarTpe) {
      deleteFile(req.file.filename);
      return res.status(200).json({ message: "Car type already exist" });
    }
    if (!req.file) {
      return res.status(200).json({ message: "file is required.." });
    }
    const newType = new CarTypeModel({
      carFuelTypeName,
      icon: req.file.filename,
    });

    await newType.save();
    return res.status(200).json({ message: "Car type Added Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const updateType = async (req, res) => {
  const { id } = req.params;
  try {
    const { carFuelTypeName } = req.body;
    const exitingCarTpe = await CarTypeModel.findById(id);

    if (!exitingCarTpe) {
      return res.status(200).json({ message: "Car type no exist" });
    }
    const updateData = {
      carFuelTypeName,
    };
    if (req.file) {
      updateData.icon = req.file.filename;

      // If the service already has an image, delete the old file
      if (exitingCarTpe.icon) {
        deleteFile(exitingCarTpe.icon);
      }
    }

    const updatedService = await CarTypeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "CarType updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const foundedData = await CarTypeModel.findById(id);
    if (!foundedData) {
      return res.status(400).json({ message: "CarType not exist" });
    }

    deleteFile(foundedData.image);

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

module.exports = { createType, updateType, deleteType, listType };
