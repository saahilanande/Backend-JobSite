const router = require("express").Router();
let post = require("../Modal/Postings.model");
let getAllApikey = require("../Middleware/GetAllApiKey");
const Joi = require("joi");
const cors = require("cors");
const { query } = require("express");
const jwtAuth = require("../Middleware/JwtAuth");
router.use(cors());

//Endpoint to get all the post
router.route("/").get(jwtAuth, async (req, res) => {
  if (
    getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key)) ||
    req.query.api_key != ""
  ) {
    let filterObj = {};

    //if location filter provided
    if (req.query.location && req.query.location != "") {
      filterObj.location = { $regex: req.query.location, $options: "i" };
    }

    //if JobTitle filter provided
    if (req.query.title && req.query.title != "") {
      filterObj.title = { $regex: req.query.title, $options: "i" };
    }

    //If jobtype filter is provided
    if (req.query.job_type) {
      filterObj.job_type = req.query.job_type;
    }
    //If employment filter is provided
    if (req.query.employment_type) {
      filterObj.employment_type = req.query.employment_type;
    }
    //If Date filter is provided
    if (req.query.updatedAt) {
      const date = new Date();
      const previousDate = new Date();
      if (req.query.updatedAt === "anytime") {
        previousDate.setDate(previousDate.getDate() - 600);
      }
      if (req.query.updatedAt === "today") {
        previousDate.setDate(previousDate.getDate() - 1);
      }
      if (req.query.updatedAt === "week") {
        previousDate.setDate(previousDate.getDate() - 7);
      }
      if (req.query.updatedAt === "month") {
        previousDate.setDate(previousDate.getDate() - 30);
      }
      filterObj.updatedAt = {
        $gte: new Date(previousDate),
        $lt: new Date(date),
      };
    }
    console.log(filterObj);
    await post
      .find(filterObj)
      .then((exe) => res.json(exe))
      .catch((err) => res.status(400).json("Error" + err));
  } else {
    res.send("unathorized access");
  }
});

router.route("/:id").get(async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
    await post
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

router.route("/addpost").post(async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
    const schema = Joi.object({
      employer_id: Joi.required(),
      title: Joi.string().min(2).required(),
      job_description: Joi.string().min(2).required(),
      job_type: Joi.string().required(),
      employment_type: Joi.string(),
      location: Joi.string().min(2),
      salary: Joi.number().required(),
    });

    const validation = schema.validate(req.body);

    if (validation.error) {
      res.send(validation.error.message);
    } else {
      const postData = req.body;
      const newPost = new post({
        employer_id: postData.employer_id,
        title: postData.title,
        job_description: postData.job_description,
        job_type: postData.job_type,
        employment_type: postData.employment_type,
        location: postData.location,
        salary: postData.salary,
      });

      await newPost
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

router.route("/delete/:id").delete(async (req, res) => {
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
    const id = req.params.id;
    await post
      .findByIdAndDelete(id)
      .then((emp) => {
        if (!emp) {
          return res.status(404).json("Post not Find with ID").send();
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
  if (getAllApikey().then((apikeys) => apikeys.includes(req.query.api_key))) {
    const id = req.params.id;

    await post
      .findByIdAndUpdate(id, req.body, { new: true })
      .then((emp) => {
        if (!emp) {
          return res.status(404).json("post not Find with ID").send();
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
