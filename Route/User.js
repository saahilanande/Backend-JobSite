const router = require("express").Router();
let user = require("../Modal/User.model");
const Joi = require("joi");

let apiKey = "saahil";

router.route("/").get(async (req, res) => {
  if (req.query.api_key == apiKey) {
    await user
      .find()
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error" + err));
  } else {
    res.send("unathorized access");
  }
});

router.route("/:id").get(async (req, res) => {
  if (req.query.api_key == apiKey) {
    await user
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json("User not Find with ID:" + user)
            .send();
        }
        res.send(user);
      })
      .catch((err) => res.status(400).json("Error" + err));
  } else {
    res.send("unathorized access");
  }
});

router.route("/adduser").post(async (req, res) => {
  const skillSchema = Joi.object({
    skill_name: Joi.string(),
    skill_level: Joi.number(),
  });

  const listSchema = Joi.array().items(skillSchema);

  const schema = Joi.object({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    email: Joi.string().min(2).required(),
    api_key: Joi.string().min(2).required(),
    usage: Joi.number().required(),
    password: Joi.string().alphanum().required(),
    phone: Joi.number().integer().min(10000000).max(99999999999),
    location: Joi.string().min(2),
    skills: listSchema.required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.send(validation.error);
  } else {
    const userData = req.body;
    const newUser = new user({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      api_key: userData.api_key,
      usage: userData.usage,
      password: userData.password,
      phone: userData.phone,
      location: userData.location,
      skills: userData.skills,
    });

    await newUser
      .save()
      .then(() => {
        res.json("New User Added");
      })
      .catch((err) => {
        res.status(400).json("Error" + err);
      });
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  if (req.query.api_key == apiKey) {
    const id = req.params.id;
    await user
      .findByIdAndDelete(id)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json("User not Find with ID:" + user)
            .send();
        }
        res.send(user);
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

    await user
      .findByIdAndUpdate(id, req.body, { new: true })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json("User not Find with ID:" + user)
            .send();
        }
        res.send(user);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    res.send("unathorized access");
  }
});

module.exports = router;