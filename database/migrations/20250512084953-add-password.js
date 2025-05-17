'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Check if the 'password' column already exists


    queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: [6, 20]
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'password');
  }
};
