const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
    },
    ownersName: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    manufactureYear: {
      type: Date,
      required: true,
    },
    engineNumber: {
      type: Number,
      required: true,
    },
    chassisNumber: {
      type: String,
      required: true,
    },
    clientMobileNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10}$/, // Ensure it's a 10-digit number
    },
    clientDateOfBirth: {
      type: Date,
      required: true,
    },
    currentKMS: {
      type: Number,
      required: true,
      min: 0,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
vehicleSchema.pre("find", function () {
  this.where({ isDeleted: false }); // Exclude soft-deleted items
});

vehicleSchema.pre("findOne", function () {
  this.where({ isDeleted: false }); // Exclude soft-deleted items
});
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
