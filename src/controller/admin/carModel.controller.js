const deleteFile = require("../../common/deleteFile");
const CarModel = require("../../model/carmodel.model");

const listModel = async (req, res) => {
  try {
    const existingService = await CarModel.find();

    // Check if no services were found
    if (existingService.length === 0) {
      return res.status(404).json({ message: "No car type found" });
    }

    // Map the results to a more readable format
    const response = existingService.map(
      ({ _id, icon, carModelName, fuelType }) => ({
        _id,
        icon,
        carModelName,
        fuelType,
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
const createModel = async (req, res) => {
  try {
    const { carModelName, fuelType } = req.body;
    const exitingModel = await CarModel.findOne({
      carModelName: carModelName,
    });

    if (exitingModel) {
      deleteFile(req.file.filename);
      return res.status(200).json({ message: "Car model already exist" });
    }
    if (!req.file) {
      return res.status(200).json({ message: "file is required.." });
    }
    const newModel = new CarModel({
      carModelName,
      fuelType,
      icon: req.file.filename,
    });

    await newModel.save();
    return res.status(200).json({ message: "Car model Added Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const updateModel = async (req, res) => {
  const { id } = req.params;
  try {
    const { carModelName, fuelType } = req.body;
    const exitingModel = await CarModel.findById(id);

    if (!exitingModel) {
      return res.status(200).json({ message: "Car model no exist" });
    }
    const updateData = {
      carModelName,
      fuelType,
    };
    if (req.file) {
      updateData.icon = req.file.filename;

      // If the service already has an image, delete the old file
      if (exitingModel.icon) {
        deleteFile(exitingModel.icon);
      }
    }

    const updatedModel = await CarModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: "CarModel updated successfully",
      data: updatedModel,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error ? error : error.message,
    });
  }
};

const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const foundedData = await CarModel.findById(id);
    if (!foundedData) {
      return res.status(400).json({ message: "CarModel not exist" });
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

module.exports = { listModel, updateModel, deleteModel, createModel };
