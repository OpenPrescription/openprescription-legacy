'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define('Prescription', {
    doctorId: DataTypes.INTEGER,
    patientName: DataTypes.STRING,
    patientEmail: DataTypes.STRING,
    patientDocumentId: DataTypes.STRING,
    doctorCompanyId: DataTypes.STRING,
    hash: DataTypes.STRING,
    certificateHash: DataTypes.STRING,
    maxUses: DataTypes.INTEGER,
    digitalSignature: DataTypes.TEXT,
    private: DataTypes.BOOLEAN,
    prescriptionUrl: DataTypes.TEXT,
    certificateUrl: DataTypes.TEXT,
    ip: DataTypes.STRING,
    expiredAt: DataTypes.DATE,
    invalidAt: DataTypes.DATE,
    disabledAt: DataTypes.DATE
  }, {});
  Prescription.associate = function(models) {
    Prescription.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
    Prescription.hasMany(models.DrugsDispensing, { foreignKey: 'prescriptionId' });
  };
  return Prescription;
};