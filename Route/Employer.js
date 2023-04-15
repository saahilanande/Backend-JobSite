const router = require("express").Router();
let employer = require("../Modal/Employer.model");
const Joi = require("joi");

// router.route("/").get(async (req, res) => {
//   await employer
//     .find()
//     .then((emp) => res.json(emp))
//     .catch((err) => res.status(400).json("Error" + err));
// });

let apiKey = "saahil";

router.route("/validateemployer").get(async (req, res) => {
  if (req.query.api_key == apiKey) {
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
            res.status(200).json("Success");
          } else {
            res.status(400).json("INVALID Credentails");
          }
        })
        .catch((err) => res.status(400).json(err));
    }
  } else {
    res.send("unathorized access");
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
    name: Joi.string().min(2).required(),
    email: Joi.string().min(2).required(),
    password: Joi.string().alphanum().required(),
    api_key: Joi.string().min(2).required(),
    usage: Joi.number().required(),
    phone: Joi.number().integer().min(10000000).max(99999999999),
    location: Joi.string().min(2),
    industry: Joi.string(),
    company_description: Joi.string(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.send(validation.error.message);
  } else {
    const employerData = req.body;
    const newEmployer = new employer({
      company_name: employerData.company_name,
      name: employerData.name,
      email: employerData.email,
      password: employerData.password,
      api_key: employerData.api_key,
      usage: employerData.usage,
      phone: employerData.phone,
      location: employerData.location,
      industry: employerData.industry,
      company_description: employerData.company_description,
    });

    await newEmployer
      .save()
      .then(() => {
        res.json("New Employer Added");
      })
      .catch((err) => {
        res.status(400).json("Error" + err);
      });
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
