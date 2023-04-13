const router = require("express").Router();
let post = require("../Modal/Postings.model");

router.route("/").get(async (req, res) => {
  await post
    .find()
    .then((exe) => res.json(exe))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/:id").get(async (req, res) => {
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
});

router.route("/addpost").post(async (req, res) => {
  const postData = req.body;
  const newPost = new post({
    employer_id: postData.employer_id,
    title: postData.title,
    job_description: postData.job_description,
    job_type: postData.job_type,
    location: postData.location,
    salary: postData.salary,
    post_date: postData.postData,
  });

  await newPost
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
});

router.route("/update/:id").put(async (req, res) => {
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
});

module.exports = router;
