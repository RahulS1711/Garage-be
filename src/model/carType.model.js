const mongoose = require("mongoose");
const carTypeSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    carFuelTypeName: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
carTypeSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
carTypeSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});
const CarTypeModel = mongoose.model("carType", carTypeSchema);

module.exports = CarTypeModel;
