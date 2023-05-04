const router = require("express").Router();
let application = require("../Modal/Application.model");
let getAllApikey = require("../Middleware/GetAllApiKey");
const Joi = require("joi");
const cors = require("cors");
const jwtAuth = require("../Middleware/JwtAuth");
router.use(cors());

router.route("/").get(jwtAuth, async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
    await application
      .find()
      .then((exe) => res.json(exe))
      .catch((err) => res.status(400).json("Error" + err));
  } else {
    res.send("unathorized access");
  }
});

router.route("/:id").get(jwtAuth, async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
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
  } else {
    res.send("unathorized access");
  }
});

router.route("/applied/:id").get(jwtAuth, async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
    await application
      .find({ user_id: req.params.id })
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

router.route("/addapplication").post(jwtAuth, async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
    const schema = Joi.object({
      job_id: Joi.required(),
      user_id: Joi.required(),
      application_date: Joi.date().required(),
      resume_file: Joi.string(),
    });

    const validation = schema.validate(req.body);

    if (validation.error) {
      res.send(validation.error.message);
    } else {
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
    }
  } else {
    res.send("unathorized access");
  }
});

router.route("/delete/:id").delete(jwtAuth, async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
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
  } else {
    res.send("unathorized access");
  }
});

router.route("/update/:id").put(jwtAuth, async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
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
  } else {
    res.send("unathorized access");
  }
});

module.exports = router;

// .aggregate([
//   { $match: { user_id: userId } },
//   {
//     $lookup: {
//       from: "Posting",
//       localField: "job_id",
//       foreignField: "_id",
//       as: "JobApplied",
//     },
//   },
// ])
