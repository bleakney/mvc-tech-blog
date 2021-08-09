// set up dependencies
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection')
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize');

// // set up session persistence
// const sess = {
//     secret: "grandma's chocolate chip cookies",
//     cookie: {},
//     resave: false,
//     saveUninitialized: true,
//     store: new SequelizeStore({
//         db: sequelize
//     })
// };

const app = express();
const PORT = process.env.PORT || 3001;

// app.use(session(sess));

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// set up handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
    app.listen(PORT, () => console.log('Now listening!'));

