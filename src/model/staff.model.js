const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    branchID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // Reference to Branch Schema
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["technician", "manager", "admin"],
      required: true,
    },
    skills: {
      type: [String],
      default: [], // Example: ['Plumbing', 'Electrical', 'Mechanical']
    },
    assignedRepairs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repair", // Repairs assigned to the employee
      },
    ],
    hireDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "Active",
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
staffSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

staffSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const StaffModel = mongoose.model("Staff", staffSchema);
module.exports = StaffModel;
