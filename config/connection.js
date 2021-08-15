const Sequelize = require('sequelize');
const seedAll = require('../seeds/index');

require('dotenv').config()

// create connection to our database, pass in mysql credentials
let sequelize;


// use credentials through jawsdb if accessing heroku deployment
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
    // seed database
    seedAll();
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
};

module.exports = sequelize;