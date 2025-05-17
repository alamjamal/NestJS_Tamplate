'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'mobile', {
      type: Sequelize.STRING(10),
      allowNull: true,
      unique: true,
    });


    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    function generateRandomNumber() {
      const min = 1000000000; // 10-digit number
      const max = 9999999999; // 10-digit number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (const user of users) {
      await queryInterface.sequelize.query(
        `UPDATE "Users" SET mobile = ${generateRandomNumber()} WHERE id = '${user.id}';`
      );
    }


    await queryInterface.changeColumn('Users', 'mobile', {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        len: [10, 10],
        is: /^[6-9]{1}[0-9]{9}$/ // Indian mobile validation
      },
    });


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'mobile');

  }
};
