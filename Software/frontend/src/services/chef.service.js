import axios from './root.service.js';

export const preparar = async (requiredIngredients) => {
  try {
    const response = await axios.post('/chef/preparar', requiredIngredients);
    
    if(response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error.response);
    return { success: false, message: error.response?.data?.message || "Error de servidor" };
  }
};
