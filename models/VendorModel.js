import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Vendor = db.define("vendors", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  }
});

export default Vendor;
