const VehicleModel = require("../../model/vehicleDetails.model");

const yup = require("yup");

// Define the Yup validation schema
const vehicleSchema = yup.object().shape({
  // Auto-fetched vehicle details
  registrationNumber: yup
    .string()
    .required("Registration number is required")
    .trim()
    .uppercase()
    .matches(/^[A-Z0-9]+$/, "Registration number must be alphanumeric")
    .max(20, "Registration number must be at most 20 characters"),
  ownersName: yup
    .string()
    .trim()
    .max(100, "Owner name must be at most 100 characters"),
  carModel: yup
    .string()
    .trim()
    .max(50, "Car model must be at most 50 characters"),
  manufactureYear: yup
    .number()
    .min(1900, "Year of manufacture must be after 1900")
    .max(
      new Date().getFullYear(),
      "Year of manufacture cannot be in the future"
    )
    .integer("Year of manufacture must be an integer"),
  engineNumber: yup
    .string()
    .trim()
    .uppercase()
    .matches(/^[A-Z0-9]+$/, "Engine number must be alphanumeric")
    .max(50, "Engine number must be at most 50 characters"),
  chassisNumber: yup
    .string()
    .trim()
    .uppercase()
    .matches(/^[A-Z0-9]+$/, "Chassis number must be alphanumeric")
    .max(50, "Chassis number must be at most 50 characters"),

  // Additional client information
  clientMobileNumber: yup
    .string()
    .required("Mobile number is required")
    .trim()
    .matches(/^[0-9]{10}$/, "Mobile number must be a 10-digit number"),
  clientDateOfBirth: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  currentKMS: yup
    .number()
    .required("Current KMS is required")
    .min(0, "Current KMS must be a positive number"),
  clientEmail: yup
    .string()
    .required("Email is required")
    .trim()
    .email("Invalid email format")
    .max(100, "Email must be at most 100 characters"),
});

const addDetails = async (req, res) => {
  try {
    await vehicleSchema.validate(req.body);
    const {
      registrationNumber,
      ownersName,
      carModel,
      manufactureYear,
      engineNumber,
      chassisNumber,
      clientMobileNumber,
      clientDateOfBirth,
      currentKMS,
      clientEmail,
    } = req.body;

    if (!req.body) {
      return res.status(400).json({ message: "please fill all the details" });
    }

    const checkRegistration = await VehicleModel.findOne({
      registrationNumber: registrationNumber,
    });

    if (checkRegistration) {
      return res
        .status(400)
        .json({ message: "vehicle details already added..." });
    }
    const vehicle = new VehicleModel({
      registrationNumber,
      ownersName,
      carModel,
      manufactureYear,
      engineNumber,
      chassisNumber,
      clientMobileNumber,
      clientDateOfBirth: new Date(clientDateOfBirth),
      currentKMS,
      clientEmail,
    });

    let newVehicle = await vehicle.save();

    return res
      .status(200)
      .json({ message: "vehicle data added successfully", data: newVehicle });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};
const updateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      registrationNumber,
      ownersName,
      carModel,
      manufactureYear,
      engineNumber,
      chassisNumber,
      clientMobileNumber,
      clientDateOfBirth,
      currentKMS,
      clientEmail,
    } = req.body;

    if (!req.body) {
      return res.status(400).json({ message: "please fill all the details" });
    }

    const checkRegistration = await VehicleModel.findOne({
      registrationNumber: registrationNumber,
    });

    if (!checkRegistration) {
      return res.status(400).json({ message: "please add vehicle details" });
    }
    const vehicle = await VehicleModel.findOneAndUpdate(
      { _id: id },
      {
        registrationNumber,
        ownersName,
        carModel,
        manufactureYear,
        engineNumber,
        chassisNumber,
        clientMobileNumber,
        clientDateOfBirth: new Date(clientDateOfBirth),
        currentKMS,
        clientEmail,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "vehicle data updated successfully", data: vehicle });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};

const removeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteData = await VehicleModel.findOne({ _id: id });

    if (!deleteData) {
      return res
        .status(400)
        .json({ message: `branch not found on this ${id} id` });
    }
    deleteData.isDeleted = true;
    deleteData.deletedAt = Date.now();

    await deleteData.save();

    res.status(200).json({ message: "vehicle deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = { addDetails, updateDetails, removeDetails };
