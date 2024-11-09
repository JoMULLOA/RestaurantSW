import { prepararin } from "../services/chef.service.js";

export const prepararinall = async (req, res) => {
  
    try {
      const requiredIngredients = req.body;
      

      console.log("Datos recibidos en el body:", requiredIngredients);
      // Validar los datos que llegan por el body con joi -> nombre y cantidad
      const [dataPreparin, errorPreparin] = await prepararin(requiredIngredients);
      /*
      console.log(dataPreparin);
      console.log(errorPreparin);*/
      
      if(errorPreparin) return res.status(400).json({ status: "Error", data: null });
      res.status(200).json({ status: "Success", data: dataPreparin });
    } catch (error) {
      // Enviar mensaje de error en caso de falla
      res.status(500).json({ status: "Error", message: error.message });
    }
  };