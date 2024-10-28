"use strict";
import Ingrediente from "../entity/ingrediente.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
//Esta es la estructura de la tabla ingredientes
// CREATE TABLE ingredientes
// (
// 	id int,
// 	tipo varchar(20),
// 	cantidad int,
// 	fechaIngreso timestamp
// )

export async function getIngredienteService(query) {
  try {
    const { id, tipo } = query;

    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    const ingredienteFound = await ingredienteRepository.findOne({
      where: [{ id: id }, { tipo: tipo }],
    });

    if (!ingredienteFound) return [null, "Ingrediente no encontrado"];

    const { password, ...userData } = ingredienteFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el ingrediente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getIngredientesService() {
  try {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    const ingredientes = await ingredienteRepository.find();

    if (!ingredientes || ingredientes.length === 0) return [null, "No hay ingredientes"];

    const ingredientesData = ingredientes.map(({ password, ...user }) => user);

    return [ingredientesData, null];
  } catch (error) {
    console.error("Error al obtener los ingredientes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateIngredienteService(query, body) {
  try {
    const { id, tipo } = query;

    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    const ingredienteFound = await ingredienteRepository.findOne({
      where: [{ id: id }, { tipo: tipo }],
    });

    if (!ingredienteFound) return [null, "Ingrediente no encontrado"];

    const existingIngrediente = await ingredienteRepository.findOne({
      where: [{ tipo: body.tipo }],
    });

    if (existingIngrediente && existingIngrediente.id !== ingredienteFound.id) {
      return [null, "Ingrediente ya existe"];
    }

    const updatedIngrediente = await ingredienteRepository.save({
      ...ingredienteFound,
      ...body,
    });

    return [updatedIngrediente, null];
  } catch (error) {
    console.error("Error al actualizar el ingrediente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createIngredienteService(body) {
  try {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    const existingIngrediente = await ingredienteRepository.findOne({
      where: [{ tipo: body.tipo }],
    });

    if (existingIngrediente) return [null, "Ingrediente ya existe"];

    const newIngrediente = await ingredienteRepository.save(body);

    return [newIngrediente, null];
  } catch (error) {
    console.error("Error al crear el ingrediente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteIngredienteService(query) {
  try {
    const { id, tipo } = query;

    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    const ingredienteFound = await ingredienteRepository.findOne({
      where: [{ id: id }, { tipo: tipo }],
    });

    if (!ingredienteFound) return [null, "Ingrediente no encontrado"];

    await ingredienteRepository.remove(ingredienteFound);

    return [ingredienteFound, null];
  } catch (error) {
    console.error("Error al eliminar el ingrediente:", error);
    return [null, "Error interno del servidor"];
  }
}

