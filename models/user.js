'use strict';
const {
  Model
} = require('sequelize');

const {hashPassword} =require('../helper/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.photo, { foreignKey: "userId"})
    }
  }
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeCreate: (user) => {
        const hashedPass = hashPassword(user.password)

        user.password = hashedPass
      }
    }
  });
  return user;
};