const seedAll = require('../seeds/index');
const Sequelize = require('sequelize');

require('dotenv').config()

// seed database
seedAll();

// use credentials through jawsdb if accessing heroku deployment
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
    })

module.exports = sequelize;