module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "Doctors",
        "lastVerificationAt",
        {
          type: Sequelize.DataTypes.DATE,
          after: 'documentId'
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Doctors",
        "doctorExtraInfo",
        {
          type: Sequelize.DataTypes.TEXT,
          after: 'lastVerificationAt'
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("Doctors", "lastVerificationAt", {
        transaction,
      });
      await queryInterface.removeColumn("Doctors", "doctorExtraInfo", {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
