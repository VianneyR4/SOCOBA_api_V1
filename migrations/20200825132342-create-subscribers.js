'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('subscribers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            avatar: {
                type: Sequelize.STRING
            },
            fname: {
                type: Sequelize.STRING
            },
            sname: {
                type: Sequelize.STRING
            },
            lname: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.STRING
            },
            rollNumber: {
                type: Sequelize.INTEGER
            },
            address: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            password: {
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
        await queryInterface.dropTable('subscribers');
    }
};