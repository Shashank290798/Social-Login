const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const INTEGER = DataTypes.INTEGER;
const STRING = DataTypes.STRING;

const _model = sequelize.define('User', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    microsoftId: {
        type: STRING,
    },
    googleId: {
        type: STRING,
    },
    firstName: {
        type: STRING,
    },
    lastName: {
        type: STRING,
    },
    email: {
        type: STRING,
        allowNull: false
    },
    password: {
        type: STRING,
        allowNull: true
    }
});

module.exports = _model;
