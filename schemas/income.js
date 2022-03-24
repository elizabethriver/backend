const mongoose = require("mongoose");
const { Schema } = mongoose;

const IncomeData = new Schema({
  product: { type: String, required: true },
  income: { type: Number, required: true },
});

module.exports = mongoose.model("IncomeData", IncomeData);
