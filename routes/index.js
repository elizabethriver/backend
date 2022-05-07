const express = require("express");
const router = express.Router();
const IncomeData = require("../schemas/income");
const ExpensesData = require("../schemas/expense");
const Users = require("../schemas/users");
const authenticateToken = require("../middleware/middleware");
const signJWT = require("../signJWT/signJWT");
const compareSync = require("../bcrypt/compareSync");
const hashSync = require("../bcrypt/hashSync");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).send({ mssg: "Empty inputs" });
  } else {
    if (typeof email !== "string" || typeof password !== "string") {
      res
        .status(400)
        .send({ mssg: "Bad request, please verify your inputs" })
        .end();
    } else {
      // Load hash from your password DB.
      try {
        const userFinned = await Users.findOne({ email }).exec();
        if (userFinned === null) {
          res
            .status(400)
            .send({ mssg: `user with ${email} not found` })
            .end();
        }
        const { name } = userFinned;
        const passwordCompare = compareSync(password, userFinned.password);
        if (!passwordCompare) {
          res
            .status(400)
            .send({ mssg: `user with ${email} has a password incorrect` })
            .end();
        } else {
          const token = signJWT({ email }, "2h");
          res.status(200).send({ token, name }).end();
        }
      } catch (error) {
        res.status(404).send({ mssg: error }).end();
        throw error;
      }
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
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    res.status(400).send({ mssg: "Empty inputs" }).end();
  } else {
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
        res.status(422).send({ mssg: "Password doesn't match" }).end();
      } else {
        try {
          const userFinned = await Users.findOne({ email }).exec();
          if (userFinned) {
            res
              .status(422)
              .send({ mssg: `${email} already exists` })
              .end();
            
          } else {
            registerUser.save(() => {
              res.status(200).send({ registerUser }).end();
            });
          }
        } catch (error) {
          res.status(404).send({ mssg: error }).end();
          throw error;
        }
      }
    }
  }
});

router.get("/dashboard", authenticateToken, async (res) => {
  try {
    const incomeAll = await IncomeData.find({});
    const expensesAll = await ExpensesData.find({});
    res.status(200).send({ incomeAll, expensesAll }).end();
  } catch (error) {
    res.status(404).send({ mssg: error }).end();
    throw error;
  }
});

router.post("/income", authenticateToken, async (req, res) => {
  const { product, income } = req.body;
  const registerIncome = new IncomeData({
    product,
    income,
  });
  if (product === "" || income === "") {
    res.status(400).send({ mssg: "Empty inputs" }).end();
  } else {
    if (typeof product !== "string" || typeof income !== "number") {
      res.status(400).send({ mssg: "Bad request. Verify your inputs" }).end();
    } else {
      try {
        const userFinned = await IncomeData.findOne({ product }).exec();
        if (userFinned !== null) {
          res
            .status(422)
            .send({
              mssg: `product with name ${product} already exists`,
            })
        } else {
          registerIncome.save(function () {
            res.status(200).send({ registerIncome }).end();
          });
        }
      } catch (error) {
        res.status(404).send({ mssg: error }).end();
        throw error;
      }
    }
  }
});

router.get("/income/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    //search data with id
    const findedObject = await IncomeData.findById(id).exec();
    if (findedObject === null) {
      res
        .status(404)
        .send({ mssg: `product ID ${id} does not exist` })
        .end();

    } else {
      res.status(200).send({ findedObject }).end();
    }
  } catch (error) {
    res.status(404).send({ mssg: error }).end();
    throw error;
  }
});

router.put("/income/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { product, income } = req.body;
  if (product === "" || income === "") {
    res.status(400).send({ mssg: "Empty inputs" }).end();
  } else {
    if (typeof product !== "string" || typeof income !== "number") {
      res.status(400).send({ mssg: "Bad request" }).end();
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
        if (docUpdate === null) {
          res
            .status(404)
            .send({ mssg: `Product with ID ${id} does not exist` })
            .end();
          
        } else {
          res.status(200).send({ docUpdate }).end();
        }
      } catch (error) {
        res.status(404).send({ mssg: error }).end();
        throw error;
      }
    }
  }
});

router.delete("/income/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  //search data with id
  IncomeData.findByIdAndDelete(id, (error, docs) => {
    if (error) {
      res.status(404).send({ error }).end();
      throw error;
    } else {
      if (docs === null) {
        res
          .status(404)
          .send({ msg: `Docs with ID ${id} doesn't exist` })
          .end();
       
      } else {
        res.status(200).send({ docs }).end();
      }
    }
  });
});

router.post("/expense", authenticateToken, async (req, res) => {
  const { product, expense } = req.body;
  const registerExpenses = new ExpensesData({
    product,
    expense,
  });
  if (product === "" || income === "") {
    res.status(400).send({ mssg: "Empty inputs" }).end();
  }
  if (typeof product !== "string" || typeof expense !== "number") {
    res.status(400).send({ mssg: "Bad request. Verify your inputs" }).end();
  } else {
    try {
      const productFind = await ExpensesData.findOne({ product }).exec();
      if (productFind !== null) {
        res
          .status(422)
          .send({
            mssg: `product with name ${product} already exists`,
          })
          .end();
      
      } else {
        registerExpenses.save(() => {
          res.status(200).send(registerExpenses).end();
        });
      }
    } catch (error) {
      res.status(404).send({ mssg: error }).end();
      throw error;
    }
  }
});

router.get("/expense/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    //search data with id
    const findedObject = await ExpensesData.findById(id).exec();
    if (findedObject === null) {
      res
        .status(404)
        .send({ mssg: `product ID ${id} does not exist` })
        .end();
   
    } else {
      res.status(200).send({ findedObject }).end();
    }
  } catch (error) {
    res.status(404).send({ mssg: error }).end();
    throw error;
  }
});

router.put("/expense/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { product, expense } = req.body;
  if (product === "" || income === "") {
    res.status(400).send({ mssg: "Empty inputs" }).end();
  }
  if (typeof product !== "string" || typeof expense !== "number") {
    res.status(400).send({ mssg: "Bad request" }).end();
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
      if (docUpdate === null) {
        res
          .status(404)
          .send({ mssg: `Product with ID ${id} does not exist` })
          .end();
   
      } else {
        res.status(200).send({ docUpdate }).end();
      }
    } catch (error) {
      res.status(404).send({ mssg: error }).end();
      throw error;
    }
  }
});

router.delete("/expense/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  //search data with id
  ExpensesData.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(404).send({ error }).end();
      throw error;
    } else {
      if (docs === null) {
        res
          .status(404)
          .send({ msg: `Docs with ID ${id} doesn't exist` })
          .end();
       
      } else {
        res.status(200).send({ docs }).end();
      }    }
  });
});

module.exports = router;
