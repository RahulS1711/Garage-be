const UserModel = require("../../model/user.model");
const bcrypt = require("bcrypt");
const Yup = require("yup");
const { signJwtToken } = require("../../utils/common");
const phoneNumberRegex = /^[6789]\d{9}$/;
const passwordRegex = /^[a-zA-Z0-9]{3,30}$/;
const SALT_ROUNDS = 10;
const mongoose = require("mongoose");

// Function to validate if a string is a valid ObjectId

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};
const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long.")
    .max(30, "Name must be at most 30 characters long.")
    .required("Name is required."),

  contactNo: Yup.string()
    .matches(
      phoneNumberRegex,
      "Contact number must be a valid Indian phone number."
    )
    .required("Contact number cannot be empty."),

  email: Yup.string()
    .email("Email must be a valid email address.")
    .required("Email is required."),

  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must be between 3 and 30 characters and can only contain letters and numbers."
    )
    .required("Password cannot be empty."),
  vehicle_id: Yup.array()
    .of(
      Yup.string()
        .required("Vehicle ID is required")
        .test(
          "is-valid-objectid",
          "Vehicle ID must be a valid ObjectId",
          isValidObjectId
        )
    )
    .nullable(), // Allow null values
});
const registerUser = async (req, res) => {
  try {
    await registerSchema.validate(req.body);
    const { name, contactNo, email, password, vehicle_id } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "user is already registerd" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new UserModel({
      name,
      contactNo,
      email,
      password: hashedPassword,
      vehicle_id,
    });

    let data = await user.save();

    const response = {
      name: data.name,
      contactNo: data.contactNo,
      email: data.email,
      vehicle_id: data.vehicle_id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return res.status(200).json({
      status: 200,
      message: "user registered successfully",
      user: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email }).populate(
      "vehicle_id"
    );
    if (!existingUser) {
      return res.status(400).json({ message: "user is not registerd" });
    }

    let comparePassword = await bcrypt.compare(password, existingUser.password);
    if (!comparePassword) {
      return res
        .status(400)
        .json({ message: "email and password is incorrect" });
    }

    const token = signJwtToken({ _id: existingUser._id });

    const response = {
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        vehicle_id: existingUser.vehicle_id,
        contactNo: existingUser.contactNo,
      },
      token: token,
    };
    return res
      .status(200)
      .json({ status: 200, message: "user signin successfully", response });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error ? error.errors : error,
    });
  }
};

module.exports = { registerUser, loginUser };
