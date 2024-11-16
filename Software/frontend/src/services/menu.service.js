import axios from './root.service.js';

export const addMenu = async (menu) => {
  try {
    const response = await axios.post('/menus/addMenu', menu);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el menu: ", error);
    throw error;
  }
};

export const getMenus = async () => {
  try {
    const response = await axios.get('/menus/all');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los menus: ", error);
    throw error;
  }
};

export const deleteMenu = async (id) => {
  try {
    const response = await axios.delete("/menus/deleteMenu/" + id);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el menu: ", error);
    throw error;
  }
};