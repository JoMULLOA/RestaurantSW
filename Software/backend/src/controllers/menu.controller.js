// pedido.controller.js
import { addMenu, getMenus, removeMenu } from "../services/menu.service.js";
import { menuBodyValidation } from "../validations/menu.validation.js";

export const getAllMenus = async (req, res) => {
  try {
    const menus = await getMenus();
    res.status(200).json({ status: "Success", data: menus });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const createMenu = async (req, res) => {
  try {
    const { error } = menuBodyValidation.validate(req.body); //Validación de los datos

    if (error) {
      return res.status(400).json({ status: "Error", message: error.message });
    }

    const menu = await addMenu(req.body);
    res.status(201).json({ status: "Success", data: menu });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};


export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedMenu = await removeMenu(id); 

    if (!deletedMenu) {
      return res.status(404).json({ status: "Error", message: "Menu no encontrado" });
    }

    res.status(200).json({ status: "Success", message: "Menu eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};
