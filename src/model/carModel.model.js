const mongoose = require("mongoose");
const carModelSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    carModelName: {
      type: String,
      required: true,
    },

    fuelType: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carType",
      },
    ],

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
carModelSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
carModelSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});
const CarModel = mongoose.model("carModel", carModelSchema);

module.exports = CarModel;
