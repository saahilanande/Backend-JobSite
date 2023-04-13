const router = require("express").Router();
let application = require("../Modal/Application.model");

router.route("/").get(async (req, res) => {
  await application
    .find()
    .then((exe) => res.json(exe))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:id").get(async (req, res) => {
  await application
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

router.route("/addapplication").post(async (req, res) => {
  const applicationData = req.body;
  const newapplication = new application({
    job_id: applicationData.job_id,
    user_id: applicationData.user_id,
    application_date: applicationData.application_date,
    resume_file: applicationData.resume_file,
  });

  await newapplication
    .save()
    .then(() => {
      res.json("New Post Added");
    })
    .catch((err) => {
      res.status(400).json("Error" + err);
    });
});

router.route("/delete/:id").delete(async (req, res) => {
  const id = req.params.id;
  await application
    .findByIdAndDelete(id)
    .then((emp) => {
      if (!emp) {
        return res.status(404).json("Application not Find with ID").send();
      }
      res.send(emp);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.route("/update/:id").put(async (req, res) => {
  const id = req.params.id;

  await application
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((emp) => {
      if (!emp) {
        return res.status(404).json("application not Find with ID").send();
      }
      res.send(emp);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
