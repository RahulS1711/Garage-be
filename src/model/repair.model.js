const mongoose = require("mongoose");

const RepairSchema = new mongoose.Schema(
  {
    branchID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // Reference to Branch Schema
      required: true,
    },
    serviceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    issueDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    costEstimate: {
      type: Number,
      required: true,
    },
    actualCost: {
      type: Number,
    },
    notes: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
RepairSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

RepairSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const RepairModel = mongoose.model("Repair", RepairSchema);
module.exports = RepairModel;
