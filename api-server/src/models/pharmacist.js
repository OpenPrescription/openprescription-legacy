'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pharmacist = sequelize.define('Pharmacist', {
    name: DataTypes.STRING,
    documentId: DataTypes.STRING,
    blockchainId: DataTypes.STRING,
    email: DataTypes.STRING,
    pharmacyId: DataTypes.STRING
  }, {});
  Pharmacist.associate = function(models) {
    // associations can be defined here
  };
  return Pharmacist;
};