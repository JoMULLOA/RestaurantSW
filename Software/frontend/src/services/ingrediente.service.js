// ingrediente.service.js

const API_URL = "http://localhost:3000/api/ingredientes";

export const addIngrediente = async (ingrediente) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingrediente),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al agregar el ingrediente: ", error);
    throw error;
  }
};

export const getIngredientes = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los ingredientes: ", error);
    throw error;
  }
};
