const express = require("express");
const router = express.Router();
const { Page, User } = require("../models");

// GET /users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

//POST /users

router.post("/", async (req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});



// GET /users/:userId
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: Page }]
    });

    if(!user) {
      res.status(404);
      next();
    } else {
      res.send(user);
    }
  } catch (error) {
    next(error);
  }
});

//DELETE /users/:userId

router.delete("/:userId", async (req, res, next) => {
  try {
    await User.destroy({
      where: {
        id: req.params.userId
      }
    });

    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
