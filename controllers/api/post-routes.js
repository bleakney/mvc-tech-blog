const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// get all posts
router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "title", "content", "user_id", "created_at"],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"]
      },
    ],
  })
    .then((postData) => res.json(postData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get a specified post
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "user_id", "created_at"],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((postData) => res.json(postData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a new post
router.post("/", (req, res) => {
    // expects {"title": "", "content": "", "user_id": ""}
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(postData => res.json(postData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// update a post's data by id
router.put('/:id', withAuth, (req, res) => {
     // expects {"title": "", "content": "", "user_id": ""}
     Post.update(req.body, {
         where: {
             id: req.params.id
         }
     })
     .then(postData => {
         if(!postData) {
             res.status(404).json({ message: 'No user found with this id!' });
             return;
         }
         res.status(200).json({ message: 'Successfully updated!' });
     })
     .catch((err) => {
         console.log(err);
         res.status(500).json(err);
     });
});

// delete a post by id
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(postData => {
        if(!postData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.status(200).json({ message: 'Successfully deleted!' });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
