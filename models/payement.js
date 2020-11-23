'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  payement.init({
    id_Subscribers: DataTypes.INTEGER,
    rollNummber: DataTypes.INTEGER,
    baurdereau: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    is_Claimed: DataTypes.BOOLEAN,
    bankName: DataTypes.STRING,
    accountNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payement',
  });
  return payement;
};