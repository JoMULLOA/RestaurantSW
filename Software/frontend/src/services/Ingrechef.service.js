const API_URL = "http://localhost:3000/api/ingredientes";

export const canPrepareDish = async () => {
    try {
      const response = await fetch(API_URL);
      return await response.json();
    } catch (error) {
      console.error("Error al obtener los ingredientes: ", error);
      throw error;
    }
  };