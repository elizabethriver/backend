
require("dotenv").config();
const router = require("./routes/index");
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const mongoString = process.env.DATABASE_PRODUCTION || process.env.DATABASE_LOCAL;

main().catch((err) => {throw new Error(err)});

async function main() {
  await mongoose.connect(mongoString);
}
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors(
  {
    origin: "http://localhost:3000/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }
));
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
