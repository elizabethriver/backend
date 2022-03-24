const router = require('./routes/index');
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoString);
  console.log('Database connected')
}
const app = express();
const port = 3000

app.use(express.json());
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





