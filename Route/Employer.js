const router = require("express").Router();
let employer = require("../Modal/Employer.model");

router.route("/").get(async (req, res) => {
  await employer
    .find()
    .then((emp) => res.json(emp))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:id").get(async (req, res) => {
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
});

router.route("/addemployer").post(async (req, res) => {
  const employerData = req.body;
  const newEmployer = new employer({
    company_name: employerData.company_name,
    name: employerData.name,
    email: employerData.email,
    password: employerData.password,
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
});

router.route("/delete/:id").delete(async (req, res) => {
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
});

router.route("/update/:id").put(async (req, res) => {
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
});

module.exports = router;
