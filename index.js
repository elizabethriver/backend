
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
app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   next();
// })
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
