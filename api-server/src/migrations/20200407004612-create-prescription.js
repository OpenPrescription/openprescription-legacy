"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Prescriptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        references: {
          // This is a reference to another model
          model: "Doctors",
          // This is the column name of the referenced model
          key: "id",
        },
      },
      patientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patientEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patientDocumentId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hash: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      certificateHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maxUses: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      digitalSignature: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      private: {
        type: Sequelize.BOOLEAN,
      },
      prescriptionUrl: {
        type: Sequelize.TEXT,
      },
      certificateUrl: {
        type: Sequelize.TEXT,
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiredAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      invalidAt: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      disabledAt: {
        type: Sequelize.DATE,
        defaultValue: null
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
    return queryInterface.dropTable("Prescriptions");
  },
};
