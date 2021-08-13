const router = require("express").Router();
const { User, Post, Comment } = require("../../models");


// get all comments
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: ["id", "comment_text", "user_id", "post_id", "created_at"]
    })
    .then(commentData => res.json(commentData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a comment
router.post('/', (req, res) => {
    // check the session
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      // use the id from the session
      user_id: req.session.user_id
    })
      .then(commentData => res.json(commentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  };
});

// update a comment by id
router.put('/:id', (req, res) => {
    // expects: {"comment_text": "", "user_id": , "post_id": }
    Comment.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(commentData => {
        if(!commentData) {
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

// delete a comment by id
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        },
    })
    .then(commentData => {
        if(!commentData) {
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