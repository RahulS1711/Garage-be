const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10}$/, // 10-digit contact number
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    type: {
      type: String,
      default: "Normal",
    },
    pincode: [
      {
        type: Number,
        required: true,
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

branchSchema.pre("find", function () {
  this.where({ isDeleted: false }); // Exclude soft-deleted items
});

branchSchema.pre("findOne", function () {
  this.where({ isDeleted: false }); // Exclude soft-deleted items
});
const branchModel = mongoose.model("Branch", branchSchema);

module.exports = branchModel;
