const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
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
            // serialize the data before passing to template
          const posts = postData.map(post => post.get({ plain: true }));
          res.render('dashboard', { 
            posts,
            loggedIn: true
           });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err)
        });
      });

module.exports = router;