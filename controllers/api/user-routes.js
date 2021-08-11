const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// get all user info
router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((userData) => res.json(userData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one unique user's info
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
    .then((userData) => {
      if (!userData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // expects {"username": "", "email": "", "password": ""}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    // .then(userData => {
    //     req.session.save(() => {
    //         req.session.user_id = userData.id;
    //         req.session.username = userData.username;
    //         req.session.loggedIn = true;

    //         res.json(userData)
    //     })
    // })
    .then((userData) => {
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// LOGIN POST REQ GOES HERE

// LOGOUT POST REQ GOES HERE

// update one user's data by id
router.put('/:id', (req, res) => {
    // expects {"username": "", "email": "", "password": ""}
    
    // pass in req.body to only update what's passed through the put request
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({ message: "No user found with this id!" });
            return;
        }
        res.status(200).json({ message: "Successfully deleted!" });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
