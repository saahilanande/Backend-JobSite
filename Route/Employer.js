const router = require("express").Router();
let employer = require("../Modal/Employer.model");
let apiKeyModel = require("../Modal/ApiKey.model");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtAuth = require("../Middleware/JwtAuth");
require("dotenv").config();
const cors = require("cors");
router.use(cors());

let apiKey = "saahil";

const genAPIKey = require("crypto").randomBytes(32).toString("hex");

router.route("/").get(jwtAuth, async (req, res) => {
  await employer
    .find()
    .then((emp) => res.json(emp))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/validateemployer").post(async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.send(validation.error.message);
  } else {
    const userCredentials = {
      email: req.body.email,
      password: req.body.password,
    };

    await employer
      .findOne(userCredentials)
      .then((user) => {
        if (user) {
          const accessToken = jwt.sign(
            { email: req.body.email },
            process.env.auth_key_secret,
            { expiresIn: "30m" }
          );
          res.status(200).json({ accessToken: accessToken });
        } else {
          res.status(400).json("INVALID Credentails");
        }
      })
      .catch((err) => res.status(400).json(err));
  }
});

router.route("/:id").get(async (req, res) => {
  if (req.query.api_key == apiKey) {
    await employer
      .findById(req.params.id)
      .then((emp) => {
        if (!emp) {
          return res
            .status(404)
            .json("User not Find with ID:" + emp)
            .send();
        }
        res.send(emp);
      })
      .catch((err) => res.status(400).json("Error" + err));
  } else {
    res.send("unathorized access");
  }
});

router.route("/addemployer").post(async (req, res) => {
  const schema = Joi.object({
    company_name: Joi.string().min(2).required(),
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    email: Joi.string().min(2).required(),
    password: Joi.string().alphanum().required(),
    phone: Joi.number().integer().min(10000000).max(99999999999),
    location: Joi.string().min(2),
    industry: Joi.string(),
    company_description: Joi.string(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.send(validation.error.message);
  } else {
    //check email already exsist in the database
    const emailFound = await employer
      .findOne({ email: req.body.email })
      .catch((err) => console.log(err));

    if (emailFound) {
      res.status(208).json("Already Exisit");
    } else {
      //add new employer to database
      const employerData = req.body;
      const newEmployer = new employer({
        company_name: employerData.company_name,
        first_name: employerData.first_name,
        last_name: employerData.last_name,
        email: employerData.email,
        password: employerData.password,
        api_key: genAPIKey,
        usage: 50,
        phone: employerData.phone,
        location: employerData.location,
        industry: employerData.industry,
        company_description: employerData.company_description,
      });

      const newApiKey = new apiKeyModel({
        email: employerData.email,
        api_key: apiKey,
        usage: 50,
      });

      await newApiKey.save().catch((err) => {
        res.status(400).json("Error" + err);
      });

      await newEmployer
        .save()
        .then(() => {
          res.status(201).json("New Employer Added");
        })
        .catch((err) => {
          res.status(400).json("Error" + err);
        });
    }
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  if (req.query.api_key == apiKey) {
    const id = req.params.id;
    await employer
      .findByIdAndDelete(id)
      .then((emp) => {
        if (!emp) {
          return res.status(404).json("employer not Find with ID").send();
        }
        res.send(emp);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    res.send("unathorized access");
  }
});

router.route("/update/:id").put(async (req, res) => {
  if (req.query.api_key == apiKey) {
    const id = req.params.id;

    await employer
      .findByIdAndUpdate(id, req.body, { new: true })
      .then((emp) => {
        if (!emp) {
          return res.status(404).json("employer not Find with ID").send();
        }
        res.send(emp);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    res.send("unathorized access");
  }
});

module.exports = router;
