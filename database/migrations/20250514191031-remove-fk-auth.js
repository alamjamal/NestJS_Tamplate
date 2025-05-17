'use strict';
module.exports = {
  async up(qi, Sequelize) {
    await qi.removeConstraint('otp', 'otp_mobile_fkey');  // adjust name as needed
  },
  async down(qi, Sequelize) {
    // re-add if you really want to roll back
    await qi.addConstraint('otp', {
      fields: ['mobile'],
      type: 'foreign key',
      name: 'otp_mobile_fkey',
      references: { table: 'Users', field: 'mobile' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
};
