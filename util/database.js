const Sequelize = require('sequelize');

const sequelize = new Sequelize('bookingform', 'root', 'arushi@mysql', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;