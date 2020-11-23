'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_Subscribers: {
        type: Sequelize.INTEGER
      },
      rollNummber: {
        type: Sequelize.INTEGER
      },
      baurdereau: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      is_Claimed: {
        type: Sequelize.BOOLEAN
      },
      bankName: {
        type: Sequelize.STRING
      },
      accountNumber: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payements');
  }
};