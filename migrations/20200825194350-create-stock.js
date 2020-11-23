'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('stocks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            itemName: {
                type: Sequelize.STRING
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            qttAlert: {
                type: Sequelize.INTEGER
            },
            qttType: {
                type: Sequelize.STRING
            },
            unitePrice: {
                type: Sequelize.INTEGER
            },
            currency: {
                type: Sequelize.STRING
            },
            isActive: {
                type: Sequelize.BOOLEAN
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
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('stocks');
    }
};