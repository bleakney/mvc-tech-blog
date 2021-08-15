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

router.get('/edit/:id', withAuth, (req, res) => {
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
        res.render('edit-post', { 
          post,
        loggedIn: req.session.loggedIn });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
    });
module.exports = router;