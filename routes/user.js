const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController.js");
const router = new express.Router();
const log=require('loglevel')


// Load Input Validation
const validateInput = require("../src/validate");


router.post("/users/signup", async (req, res) => {
  const response = validateInput.registerValidation(req.body);
  console.log("inside")
  //check Validation
  if (response.error) {
    var res_arr = [];
    response.error.details.map((error) => {
      res_arr.push(error.message);
    });
    return res.status(400).json(res_arr);
  }

  try {
    var user = await userController.createUsers(req.body);
    const token = await user.generateAuthToken();

    res.status(201).send({
      message: "User created sucessfully",
      user: user,
      token: token,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/users/login", async (req, res) => {
  const response = validateInput.loginValidation(req.body);
  //check Validation
  if (response.error) {
    var res_arr = [];
    response.error.details.map((error) => {
      res_arr.push(error.message);
    });
    return res.status(400).json(res_arr);
  }
  try {
    const user = await userController.findByCredentials(
      req.body.email,
      req.body.password
    );

    res.status(201).send({
      message: "Logged in sucessfully",
      user: user,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/users/update", auth, async (req, res) => {
  log.warn("Inside patch request")
  var failedUpdates = [];
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: "Please provide valid updates!",
    });
  }

  try {
    updates.forEach((update) => {
      // Check for duplicate update
      if (req.user[update] != req.body[update])
        req.user[update] = req.body[update];
      else failedUpdates.push(update);
    });
    if (failedUpdates.length != 0)
      return res.status(400).send({
        error:
          "Please provide different values,values provided are duplicate, ",
        values: failedUpdates,
      });
    await req.user.save();
    res.status(201).send({
      message: "User successfully updated",
      user: req.user,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/delete", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name)
    res.status(201).send({
      message: "User account deleted",
      uesr: req.user,
    });
  } catch (e) {
    res.status(500).send({
      error: e.message,
    });
  }
});

module.exports = router;
