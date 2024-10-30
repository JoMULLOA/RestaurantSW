import axios from './root.service.js';


export const addIngrediente = async (ingrediente) => {
  try {
    const response = await axios.post('/ingredientes/get',ingrediente)
    return response.data;
  } catch (error) {
    console.error("Error al agregar el ingrediente: ", error);
    throw error;
  }
};

export const getIngredientes = async () => {
  try {
    const response = await axios.get('/ingredientes/all')
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los ingredientes: ", error);
    throw error;
  }
};

export const deleteIngrediente = async (id) => {
    try {
      const response = await axios.post('/ingredientes/delete', id)
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error al eliminar el ingrediente: ", error);
      throw error;
    }
};

export const preparar = async (requiredIngredients) => {
  try {
    const response = await axios.post('/ingredientes/preparar', requiredIngredients);
    
    if(response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error.response);
  }
};
  