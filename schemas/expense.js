const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExpensesData = new Schema({
  product: { type: String, required: true },
  expense: { type: Number, required: true },
});

module.exports = mongoose.model("ExpensesData", ExpensesData);