'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('otp', 'isRemember', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('otp', 'isRemember');
  }
};
