const mongoose = require("mongoose");
const carBrandSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },

    carModel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carModel",
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deleteAt: { type: Date, default: null },
  },
  { timestamps: true }
);

carBrandSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
carBrandSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const CarBrandModel = mongoose.model("carBrand", carBrandSchema);

module.exports = CarBrandModel;
