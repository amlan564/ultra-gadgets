const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
