const router = require("express").Router();
let user = require("../Modal/User.model");
let apiKeyModel = require("../Modal/ApiKey.model");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const jwtAuth = require("../Middleware/JwtAuth");
let CheckApiKey = require("../Middleware/CheckApiKey");
require("dotenv").config();
const cors = require("cors");
router.use(cors());

//Generating a random 32 lenght string for api key
const genAPIKey = require("crypto").randomBytes(32).toString("hex");

//Base endpoint url for fetching all the users
router.route("/").get(jwtAuth, async (req, res) => {
  //Checking if the endpoint call is send with a correct apikey with checkApiKey middleware
  if (req.query.api_key && (await CheckApiKey(req.query.api_key))) {
    await user
      .find()
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error" + err));
  } else {
    res.send("unathorized access");
  }
});

//endpoint for validating a user with email and password
//After validating jwt token is added in the respose body with email id and password
router.route("/validateuser").post(async (req, res) => {
  //Creating a schema for the incoming object from the post request
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  //validate the object recevied during post request
  const validation = schema.validate(req.body);

  if (validation.error) {
    res.send(validation.error.message);
  } else {
    const userCredentials = {
      email: req.body.email,
      password: req.body.password,
    };

    //moongoose call to find the user in user collection
    await user
      .findOne(userCredentials)
      .then((user) => {
        if (user) {
          //Assigning jwt token
          const accessToken = jwt.sign(
            { email: req.body.email },
            process.env.auth_key_secret,
            { expiresIn: "30m" }
          );
          res.status(200).json({
            userId: user.id,
            accessToken: accessToken,
            api_key: user.api_key,
          });
        } else {
          res.status(204).json("INVALID Credentails");
        }
      })
      .catch((err) => res.status(400).json(err));
  }
});

//End point for fetching a single user with given Id
router.route("/:id").get(jwtAuth, async (req, res) => {
  //Checking if the endpoint call is send with a correct apikey with checkApiKey middleware
  if (req.query.api_key && (await CheckApiKey(req.query.api_key))) {
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

//Endpoint to Add a new user to the Database
router.route("/adduser").post(async (req, res) => {
  //Creating a schema for the incoming object from the post request
  const skillSchema = Joi.object({
    skill_name: Joi.string(),
    skill_level: Joi.number(),
  });

  const listSchema = Joi.array().items(skillSchema);

  const schema = Joi.object({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    email: Joi.string().min(2).required(),
    password: Joi.string().alphanum().required(),
    phone: Joi.number().integer(),
    location: Joi.string().min(2),
    skills: listSchema,
  });

  //validate the object recevied during post request
  const validation = schema.validate(req.body);

  //If Object is validated when recevied during post request
  if (validation.error) {
    res.send(validation.error.message);
  } else {
    //check email already exsist in the database
    const emailFound = await user
      .findOne({ email: req.body.email })
      .catch((err) => console.log(err));

    if (emailFound) {
      res.status(208).json("Already Exisit");
    } else {
      //add user to database
      const userData = req.body;
      const newUser = new user({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        api_key: genAPIKey,
        usage: 50,
        password: userData.password,
        phone: userData.phone,
        location: userData.location,
        skills: userData.skills,
      });

      //Generating a new Apikey for the new User
      const newApiKey = new apiKeyModel({
        email: userData.email,
        api_key: genAPIKey,
        usage: 50,
      });

      //Adding the new Apikey to the Apikey Collection
      await newApiKey
        .save()
        .then(() => {
          res.json("New User Added");
        })
        .catch((err) => {
          res.status(400).json("Error" + err);
        });

      await newUser
        .save()
        .then(() => {
          res.status(201).json("New User Added");
        })
        .catch((err) => {
          res.status(400).json("Error" + err);
        });
    }
  }
});

//Endpoint to delete a single user with his UserId
router.route("/delete/:id").delete(jwtAuth, async (req, res) => {
  //Checking if the endpoint call is send with a correct apikey with checkApiKey middleware
  if (req.query.api_key && (await CheckApiKey(req.query.api_key))) {
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

//Updating the details to a single user using his userId
router.route("/update/:id").put(jwtAuth, async (req, res) => {
  //Checking if the endpoint call is send with a correct apikey with checkApiKey middleware
  if (req.query.api_key && (await CheckApiKey(req.query.api_key))) {
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
