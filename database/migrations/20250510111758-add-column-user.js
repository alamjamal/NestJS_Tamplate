'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add each column one by one
        await queryInterface.addColumn('Users', 'role', {
            type: Sequelize.ENUM('read', 'write', 'read_write'),
            defaultValue: 'read',
            allowNull: false
        });



        await queryInterface.addColumn('Users', 'is_verified', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });

        await queryInterface.addColumn('Users', 'is_activate', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });

        await queryInterface.addColumn('Users', 'is_blocked', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove all added columns in reverse order
        await queryInterface.removeColumn('Users', 'is_verified');
        await queryInterface.removeColumn('Users', 'is_activate');
        await queryInterface.removeColumn('Users', 'is_blocked');
        await queryInterface.removeColumn('Users', 'role');
    }
};