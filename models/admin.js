'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  admin.init({
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'admin',
  });
  return admin;
};