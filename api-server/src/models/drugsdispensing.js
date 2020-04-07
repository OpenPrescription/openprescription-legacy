'use strict';
module.exports = (sequelize, DataTypes) => {
  const DrugsDispensing = sequelize.define('DrugsDispensing', {
    prescriptionId: DataTypes.INTEGER,
    pharmacyId: DataTypes.STRING,
    pharmacistId: DataTypes.STRING,
    purchaserDocumentId: DataTypes.STRING,
    digitalSignature: DataTypes.TEXT,
    ip: DataTypes.STRING
  }, {
    tableName: 'DrugsDispensing'
  });
  DrugsDispensing.associate = function(models) {
    // associations can be defined here
  };
  return DrugsDispensing;
};