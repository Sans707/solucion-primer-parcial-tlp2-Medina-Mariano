// * ARCHIVO A COMPLETAR
import {
  ProjectModel,
  ProjectTechnologyModel,
  TechnologyModel,
  UserModel,
} from "../models/index.js";

export const createProject = async (req, res) => {
  try {
    // TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
    // ? Revisar de dónde debe salir el leader del proyecto.
    // TODO: 2. Asociar al project las technologies recibidas.
    // TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
        const {
          code,
          name,
          description,
          status,
          start_date,
          budget,
          leader_id,
          technologies,
        } = req.body;
    
        const project = await ProjectModel.create({
          code,
          name,
          description,
          status,
          start_date,
          budget,
          leader_id,
        });
    
        if (technologies && technologies.length > 0) {
          await ProjectTechnologyModel.bulkCreate(
            technologies.map((technology_id) => ({
              project_id: project.id,
              technology_id,
            }))
          );
        }
    
        const projectCreated = await ProjectModel.findByPk(project.id, {
          include: [
            {
              model: UserModel,
              as: "leader",
              attributes: {
                exclude: ["password"],
              },
            },
            {
              model: TechnologyModel,
              as: "technologies",
              through: {
                attributes: [],
              },
            },
          ],
        });
    
        return res.status(201).json(projectCreated);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error interno del servidor" });
      }
    
};

export const getAllProjects = async (_req, res) => {
  try {
    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password) y sus technologies, y responder con código 200 y los projects..
      const projects = await ProjectModel.findAll({
        include: [
          {
            model: UserModel,
            as: "leader",
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: TechnologyModel,
            as: "technologies",
            through: {
              attributes: [],
            },
          },
        ],
      });
  
      return res.status(200).json(projects);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getMyProjects = async (req, res) => {
    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
    try {
        const { id } = req.params;
    
        const {
          technologies,
          code,
          name,
          description,
          status,
          start_date,
          budget,
          leader_id,
        } = req.body;
    
        const project = await ProjectModel.findByPk(id);
    
        if (!project) {
          return res.status(404).json({
            msg: "Proyecto no encontrado",
          });
        }
    
        await project.update({
          code,
          name,
          description,
          status,
          start_date,
          budget,
          leader_id,
        });
    
        if (technologies !== undefined) {
          await ProjectTechnologyModel.destroy({
            where: {
              project_id: id,
            },
          });
    
          if (technologies.length > 0) {
            await ProjectTechnologyModel.bulkCreate(
              technologies.map((technology_id) => ({
                project_id: id,
                technology_id,
              }))
            );
          }
        }
    
        const updatedProject = await ProjectModel.findByPk(id, {
          include: [
            {
              model: UserModel,
              as: "leader",
              attributes: {
                exclude: ["password"],
              },
            },
            {
              model: TechnologyModel,
              as: "technologies",
              through: {
                attributes: [],
              },
            },
          ],
        });
    
        return res.status(200).json(updatedProject);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error interno del servidor" });
      }

    };

export const updateProject = async (req, res) => {
  try {
    // TODO: 1. Actualizar el project con los datos recibidos.
    // TODO: 2. Reemplazar sus technologies si vienen en el body.
    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
    const { id } = req.params;

    const project = await ProjectModel.findByPk(id);

    if (!project) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
      });
    }

    await project.destroy();

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};