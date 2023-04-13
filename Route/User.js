const router = require("express").Router();
let user = require("../Modal/User.model");

router.route("/").get(async (req, res) => {
  await user
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:id").get(async (req, res) => {
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
});

router.route("/adduser").post(async (req, res) => {
  const userData = req.body;
  const newUser = new user({
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
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
});

router.route("/delete/:id").delete(async (req, res) => {
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
});

router.route("/update/:id").put(async (req, res) => {
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
});

module.exports = router;
