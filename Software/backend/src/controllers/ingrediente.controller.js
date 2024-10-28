"use strict";
import {
  deleteIngredienteService,
  getIngredienteService,
  getIngredientesService,
  updateIngredienteService,
} from "../services/ingrediente.service.js";
import {
  ingredienteBodyValidation,
  ingredienteQueryValidation,
} from "../validations/ingrediente.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getIngrediente(req, res) {
  try {
    const { id, tipo } = req.query;

    const { error } = ingredienteQueryValidation.validate({ id, tipo });

    if (error) return handleErrorClient(res, 400, error.message);

    const [ingrediente, errorIngrediente] = await getIngredienteService({ id, tipo });

    if (errorIngrediente) return handleErrorClient(res, 404, errorIngrediente);

    handleSuccess(res, 200, "Ingrediente encontrado", ingrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getIngredientes(req, res) {
  try {
    const [ingredientes, errorIngredientes] = await getIngredientesService();

    if (errorIngredientes) return handleErrorClient(res, 404, errorIngredientes);

    ingredientes.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Ingredientes encontrados", ingredientes);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message,
    );
  }
}

export async function updateIngrediente(req, res) {
  try {
    const { id, tipo } = req.query;
    const { body } = req;

    const { error: queryError } = ingredienteQueryValidation.validate({
      id,
      tipo,
    });

    if (queryError) return handleErrorClient(res, 400, queryError.message);

    const { error: bodyError } = ingredienteBodyValidation.validate(body);

    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [updatedIngrediente, errorIngrediente] = await updateIngredienteService(
      { id, tipo },
      body
    );

    if (errorIngrediente) return handleErrorClient(res, 404, errorIngrediente);

    handleSuccess(res, 200, "Ingrediente actualizado", updatedIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteIngrediente(req, res) {
  try {
    const { id, tipo } = req.query;

    const { error } = ingredienteQueryValidation.validate({ id, tipo });

    if (error) return handleErrorClient(res, 400, error.message);

    const [deletedIngrediente, errorIngrediente] = await deleteIngredienteService({ id, tipo });

    if (errorIngrediente) return handleErrorClient(res, 404, errorIngrediente);

    handleSuccess(res, 200, "Ingrediente eliminado", deletedIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}