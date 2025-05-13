const mongoose = require("mongoose");
const partsSchema = new mongoose.Schema(
  {
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["available", "notavailable"],
      default: "available",
    },
    description: {
      type: String,
      required: true,
    },

    lastUpdated: { type: Date, default: null },
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
partsSchema.pre("find", function () {
  this.where({ isDelete: false });
});
partsSchema.pre("findOne", function () {
  this.where({ isDelete: false });
});

const partsModel = mongoose.model("parts", partsSchema);

module.exports = partsModel;
