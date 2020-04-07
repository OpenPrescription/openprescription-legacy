'use strict';
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    blockchainId: DataTypes.STRING,
    documentId: DataTypes.STRING,
  }, {});
  Doctor.associate = function(models) {
    // associations can be defined here
  };
  return Doctor;
};