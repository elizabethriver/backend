const express = require("express");
const router = express.Router();
const IncomeData = require("../schemas/income");
const ExpensesData = require("../schemas/expense");
const Users = require("../schemas/users");
require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_PASSWORD


router.post("/login", async (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password,
  };
  if (
    typeof req.body.email !== "string" ||
    typeof req.body.password !== "string"
  ) {
    res
      .status(400)
      .send({ mssg: "Bad request, please verify your inputs" })
      .end();
  } else {
    const userFinned = await Users.findOne(loginData).exec();
    if (userFinned === null) {
      res
        .status(404)
        .send({ mssg: `user with ${loginData.email} or password incorrect` });
    } else {
      const token = jwt.sign(loginData, secret,{ expiresIn: '24h'}, { algorithm: 'RS256' });
      
      res 
        .status(200)
        // .send({ mssg: `Welcome ${loginData.email} to your wallet with` })
        .json({token})
    }
  }
});

router.post("/register", async (req, res) => {
  const registerUser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  if (
    typeof req.body.name !== "string" ||
    typeof req.body.email !== "string" ||
    typeof req.body.password !== "string" ||
    typeof req.body.confirmPassword !== "string"
  ) {
    res
      .status(400)
      .send({ mssg: "Bad request, please verify your inputs" })
      .end();
  } else {
    if (req.body.confirmPassword !== req.body.password) {
      res.status(400).send({ mssg: "Password doesn't match" }).end();
    } else {
      const emailUserInput = { email: req.body.email };
      const userFinned = await Users.findOne(emailUserInput).exec();
      if (userFinned) {
        res
          .status(404)
          .send({ mssg: `${emailUserInput.email} already exists` })
          .end();
      } else {
        registerUser.save(() => {
          res.status(200).send({ registerUser });
        });
      }
    }
  }
});
const authenticateToken =(req, res, next)=> {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(req.headers)
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, secret, (err) => {
    console.log(err)

    if (err) return res.sendStatus(403)
    
    console.log()

    next()
  })
}
router.get("/dashboard", authenticateToken, async (req, res) => {
  
  try {
    const incomeAll = await IncomeData.find({});
    const expensesAll = await ExpensesData.find({});
    res.status(200).send({ incomeAll, expensesAll });
  } catch (error) {
    res.status(404).send({ mssg: "Error" }).end();
  }
});

router.post("/income", authenticateToken, async (req, res) => {
  const registerIncome = new IncomeData({
    product: req.body.product,
    income: req.body.income,
  });
  if (
    typeof req.body.product !== "string" ||
    typeof req.body.income !== "number"
  ) {
    res.status(400).send({ mssg: "Bad request. Verify your inputs" }).end();
  } else {
    const productIncomeName = { product: req.body.product };
    const userFinned = await IncomeData.findOne(productIncomeName).exec();
    if (userFinned !== null) {
      res.status(404).send({
        mssg: `product with name ${productIncomeName.product} already exists`,
      });
    } else {
      registerIncome.save(function () {
        res.status(200).send({ registerIncome });
      });
    }
  }
});

router.get("/income/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    //search data with id
    const findedObject = await IncomeData.findById(id).exec();
    res.status(200).send({ findedObject: findedObject });
  } catch (error) {
    res.status(404).send({ mssg: "product ID does not exist" });
  }
});

router.put("/income/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const updateData = {
    product: req.body.product,
    income: req.body.income,
  };
  if (
    typeof req.body.product !== "string" ||
    typeof req.body.income !== "number"
  ) {
    res.status(400).send({ mssg: "Bad request" });
  } else {
    try {
      //search data with id
      let docUpdate = await IncomeData.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      res.status(200).send({ docUpdate: docUpdate });
    } catch (error) {
      res.status(404).send({ mssg: "ID does not exist" });
    }
  }
});

router.delete("/income/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  //search data with id
  if (id === "") {
    res.status(404).send({ mssg: "Not found" });
  } else {
    IncomeData.findByIdAndDelete(id, (error) => {
      if (error) {
        res.status(400).send({ mssg: "ID does not exist" }).end();
      } else {
        res.status(200).send({ mssg: "Removed item" });
      }
    });
  }
});

router.post("/expense", authenticateToken, async (req, res) => {
  const registerExpenses = new ExpensesData({
    product: req.body.product,
    expense: req.body.expense,
  });
  if (
    typeof req.body.product !== "string" ||
    typeof req.body.expense !== "number"
  ) {
    res.status(400).send({ mssg: "Bad request. Verify your inputs" }).end();
  } else {
    const productExpenseName = { product: req.body.product };
    const productFind = await ExpensesData.findOne(productExpenseName).exec();
    if (productFind !== null) {
      res.status(404).send({
        mssg: `product with name ${productExpenseName.product} already exists`,
      });
    } else {
      registerExpenses.save(() => {
        res.status(200).send(registerExpenses);
      });
    }
  }
});

router.get("/expense/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    //search data with id
    const findedObject = await ExpensesData.findById(id).exec();
    res.status(200).send({ findedObject });
  } catch (error) {
    res.status(400).send({ mssg: "ID does not exist" });
  }
});

router.put("/expense/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const updateData = {
    product: req.body.product,
    expense: req.body.expense,
  };
  if (
    typeof req.body.product !== "string" ||
    typeof req.body.expense !== "number"
  ) {
    res.status(400).send({ mssg: "Bad request" });
  } else {
    try {
      //search data with id
      let docUpdate = await ExpensesData.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      res.status(200).send({ docUpdate: docUpdate });
    } catch (error) {
      res.status(404).send({ mssg: "ID does not exist" });
    }
  }
});

router.delete("/expense/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  if (id === "") {
    res.status(404).send({ mssg: "Not found" });
  } else {
    //search data with id
    ExpensesData.findByIdAndDelete(id, (error) => {
      if (error) {
        res.status(400).send({ mssg: "ID does not exist" }).end();
      } else {
        res.status(200).send({ mssg: "Removed item" });
      }
    });
  }
});

module.exports = router;
