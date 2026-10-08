// * ARCHIVO A COMPLETAR
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ProjectTechnologyModel = sequelize.define(
  "ProjectTechnology",
  {
    // TODO: 1. id: entero, clave primaria y autoincremental.
    // TODO: 2. project_id: entero, obligatorio, clave foránea hacia Project.
    // TODO: 3. technology_id: entero, obligatorio, clave foránea hacia Technology.


  
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    technology_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
     // TODO: 4. Desactivar las columnas createdAt y updatedAt.
  {
    tableName: "project_technologies",
    timestamps: false,
  }

  
);
