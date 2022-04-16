const express = require("express");
const router = express.Router();
const IncomeData = require("../schemas/income");
const ExpensesData = require("../schemas/expense");
const Users = require("../schemas/users");
const authenticateToken = require("../middleware/middleware");
const signJWT = require("../signJWT/signJWT");
const compareSync = require('../bcrypt/compareSync')
const hashSync = require('../bcrypt/hashSync')

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") {
    res
      .status(400)
      .send({ mssg: "Bad request, please verify your inputs" })
      .end();
  } else {
    // Load hash from your password DB.
    const userFinned = await Users.findOne({ email }).exec();

    const passwordCompare = compareSync(password, userFinned.password)
    
    if (!passwordCompare) {
      res
        .status(400)
        .send({ mssg: `user with ${email} or password incorrect` });
    } else {
      const token = signJWT({ email }, "2h");
      res.status(200).send({ token });
    }
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const hash = hashSync(password);
  const registerUser = new Users({
    name,
    email,
    password: hash,
  });

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    res
      .status(400)
      .send({ mssg: "Bad request, please verify your inputs" })
      .end();
  } else {
    if (confirmPassword !== password) {
      res.status(400).send({ mssg: "Password doesn't match" }).end();
    } else {
      // const emailUserInput = { email };
      const userFinned = await Users.findOne({ email }).exec();
      if (userFinned) {
        res
          .status(422)
          .send({ mssg: `${email} already exists` })
          .end();
      } else {
        registerUser.save(() => {
          res.status(200).send({ registerUser });
        });
      }
    }
  }
});

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
  const { product, income } = req.body;

  const registerIncome = new IncomeData({
    product,
    income,
  });

  if (typeof product !== "string" || typeof income !== "number") {
    res.status(400).send({ mssg: "Bad request. Verify your inputs" }).end();
  } else {
    const userFinned = await IncomeData.findOne({ product }).exec();
    if (userFinned !== null) {
      res.status(422).send({
        mssg: `product with name ${product} already exists`,
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
    res.status(200).send({ findedObject });
  } catch (error) {
    res.status(404).send({ mssg: "product ID does not exist" });
  }
});

router.put("/income/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { product, income } = req.body;

  if (typeof product !== "string" || typeof income !== "number") {
    res.status(400).send({ mssg: "Bad request" });
  } else {
    try {
      //search data with id
      let docUpdate = await IncomeData.findByIdAndUpdate(
        id,
        { product, income },
        {
          new: true,
        }
      );
      res.status(200).send({ docUpdate });
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
  const { product, expense } = req.body;

  const registerExpenses = new ExpensesData({
    product,
    expense,
  });

  if (typeof product !== "string" || typeof expense !== "number") {
    res.status(400).send({ mssg: "Bad request. Verify your inputs" }).end();
  } else {
    const productFind = await ExpensesData.findOne({ product }).exec();
    if (productFind !== null) {
      res.status(422).send({
        mssg: `product with name ${product} already exists`,
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
    res.status(404).send({ mssg: "ID does not exist" });
  }
});

router.put("/expense/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { product, expense } = req.body;

  if (typeof product !== "string" || typeof expense !== "number") {
    res.status(400).send({ mssg: "Bad request" });
  } else {
    try {
      //search data with id
      let docUpdate = await ExpensesData.findByIdAndUpdate(
        id,
        { product, expense },
        {
          new: true,
        }
      );
      res.status(200).send({ docUpdate });
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
