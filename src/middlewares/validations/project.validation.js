// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { Op } from "sequelize";
import { ProjectModel, TechnologyModel, UserModel } from "../../models/index.js";

const codeRules = (optional = false) => {
  let chain = body("code");
  if (optional) chain = chain.optional();
  return chain
    .isString().withMessage("El código es obligatorio").bail()
    .trim()
    .matches(/^PRJ-[0-9]{4,6}$/).withMessage("Formato de código: PRJ-0001")
    .custom(async (code, { req }) => {
      const where = { code };
      if (optional) where.id = { [Op.ne]: req.params.id };
      const exists = await ProjectModel.findOne({ where });
      if (exists) throw new Error("El código ya existe");
      return true;
    });
};

const nameRules = (optional = false) => {
  let chain = body("name");
  if (optional) chain = chain.optional();
  return chain.isString().withMessage("El nombre es obligatorio").bail().trim()
    .isLength({ min: 3, max: 100 }).withMessage("Nombre: entre 3 y 100 caracteres");
};

const descriptionRules = (optional = false) => {
  let chain = body("description");
  if (optional) chain = chain.optional();
  return chain.isString().withMessage("La descripción es obligatoria").bail().trim()
    .isLength({ min: 10, max: 500 }).withMessage("Descripción: entre 10 y 500 caracteres");
};

const statusRules = () => body("status").optional()
  .isIn(["planning", "in_progress", "paused", "finished"])
  .withMessage("Estado no permitido");

const dateRules = (optional = false) => {
  let chain = body("start_date");
  if (optional) chain = chain.optional();
  return chain.isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("La fecha debe ser válida (AAAA-MM-DD)");
};

const budgetRules = (optional = false) => {
  let chain = body("budget");
  if (optional) chain = chain.optional();
  return chain.isFloat({ gt: 0 }).withMessage("El presupuesto debe ser positivo");
};

const leaderRules = (optional = false) => {
  let chain = body("leader_id");
  if (optional) chain = chain.optional();
  return chain.isInt({ min: 1 }).withMessage("El líder debe tener un ID válido").bail()
    .toInt()
    .custom(async (leader_id) => {
      const user = await UserModel.findByPk(leader_id);
      if (!user) throw new Error("El líder no existe o está eliminado lógicamente");
      return true;
    });
};

const technologiesRules = () => body("technologies").optional()
  .isArray().withMessage("Las tecnologías deben ser un array de IDs").bail()
  .custom(async (ids) => {
    if (!ids.every((id) => Number.isInteger(id) && id > 0)) {
      throw new Error("Cada ID de tecnología debe ser un entero positivo");
    }
    if (new Set(ids).size !== ids.length) {
      throw new Error("No deben repetirse tecnologías");
    }
    if (ids.length) {
      const count = await TechnologyModel.count({ where: { id: { [Op.in]: ids } } });
      if (count !== ids.length) throw new Error("Una o más tecnologías no existen");
    }
    return true;
  });

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  codeRules(),
  // TODO: 2. Validar name y description como obligatorios.
  nameRules(),
  descriptionRules(),
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  statusRules(),
  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  dateRules(),
  budgetRules(),
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  leaderRules(),
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  technologiesRules(),
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  codeRules(true),
  // TODO: 8. Validar name y description como opcionales y no vacíos.
  nameRules(true),
  descriptionRules(true),
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  statusRules(),
  dateRules(true),
  budgetRules(true),
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  leaderRules(true),
  // TODO: 11. Validar technologies como opcional, con ids que existan.
  technologiesRules(),
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];
