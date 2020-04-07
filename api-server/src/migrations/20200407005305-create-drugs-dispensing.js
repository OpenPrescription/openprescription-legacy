"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("DrugsDispensing", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      prescriptionId: {
        type: Sequelize.INTEGER,
        references: {
          // This is a reference to another model
          model: "Prescriptions",
          // This is the column name of the referenced model
          key: "id",
        },
      },
      pharmacyId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pharmacistId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Pharmacists",
          key: "id"
        }
      },
      purchaserDocumentId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      digitalSignature: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("DrugsDispensing");
  },
};
