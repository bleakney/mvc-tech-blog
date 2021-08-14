const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// GET LOGIN PAGE
router.get('/login', (req, res) => {
  if(req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// GET HOMEPAGE
router.get('/', (req, res) => {
  console.log(req.session);
  Post.findAll({
    attributes: ["id", "title", "content", "user_id", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ['id'],
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
  .then(postData => {
    const posts = postData.map(post => post.get({ plain: true }));
    res.render('homepage', { 
      posts,
      loggedIn: req.session.loggedIn
     });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ["id", "title", "content", "user_id", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["id", "username"]
        }
      },
      {
        model: User,
        attributes: ["id", "username"]
      }
    ]
  })
  .then(postData => {
    if(!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    };
    // serialize the data
    const post = postData.get({ plain: true });
    console.log(post);

    // pass data to template 
    res.render('single-post', { 
      post,
    loggedIn: req.session.loggedIn });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});





module.exports = router;