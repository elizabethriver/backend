
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
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  // res.header('Access-Control-Allow-Credentials', 'true');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  // next();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
})
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
