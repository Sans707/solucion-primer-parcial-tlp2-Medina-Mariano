// * ARCHIVO A COMPLETAR
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ProjectModel = sequelize.define(
  "Project",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // TODO: 1. code: string, único y obligatorio.
    code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    // TODO: 2. name: string, obligatorio.
    name: { type: DataTypes.STRING(100), allowNull: false },
    // TODO: 3. description: texto, obligatorio.
    description: { type: DataTypes.TEXT, allowNull: false },
    // TODO: 4. status: ENUM con los valores planning, in_progress, paused y finished; obligatorio y con planning como valor por defecto.
    status: {
      type: DataTypes.ENUM("planning", "in_progress", "paused", "finished"),
      allowNull: false,
      defaultValue: "planning",
    },
    // TODO: 5. start_date: fecha (solo día), obligatoria.
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    // TODO: 6. budget: decimal, obligatorio.
    budget: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    // TODO: 7. leader_id: entero, obligatorio, clave foránea hacia User.
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
  },
  { tableName: "projects" }
);
