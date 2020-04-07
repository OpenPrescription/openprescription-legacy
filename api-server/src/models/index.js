"use strict";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
const basename = path.basename(__filename);
const db = {};

const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = process.env;

// Option 1: Passing parameters separately
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql"
});

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
