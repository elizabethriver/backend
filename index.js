
require("dotenv").config();
const router = require("./routes/index");
const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

main().catch((err) => {throw new Error(err)});

async function main() {
  await mongoose.connect(mongoString);
}
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
