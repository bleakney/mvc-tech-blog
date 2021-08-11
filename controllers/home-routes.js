const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/', (req, res) => {
  // console.log(req.session);
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
    res.render('homepage', { posts });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
});



module.exports = router;