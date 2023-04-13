'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users", {
      fields: ["email"],
      type: "unique",
      name: "constraint_email_unique",
    })
    await queryInterface.addConstraint("photos", {
      fields: ["userId"],
      type: "foreign key",
      name: "user_id_fk",
      references: {
        table: "users",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("photos", "user_id_fk")
    await queryInterface.removeColumn("photos", "userId")
    await queryInterface.removeConstraint("Users", "constraint_email_unique")
  }
};