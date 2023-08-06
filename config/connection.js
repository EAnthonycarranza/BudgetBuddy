const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Your database name 
  process.env.DB_USER,      // Your database username
  process.env.DB_PW,        // Your database password 
  {
    host: 'localhost',      // Your database host 
    dialect: 'mysql',       // The dialect of your database (mysql for MySQL)
    port: 3306,             // The port number (usually 3306 for MySQL)
  }
);

module.exports = sequelize;
