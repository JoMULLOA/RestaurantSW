import { useEffect, useState } from 'react';
import { canPrepareDish } from '../services/Ingrechef.service';

const Chefsito = () => {
  const [dishes, setDishes] = useState([]);
  const [ingredientsStatus, setIngredientsStatus] = useState({});

  useEffect(() => {
    // Cargar la lista de platos y sus ingredientes al montar el componente
    const fetchDishes = async () => {
      try {
        const response = await fetch('/api/dishes'); // Cambia a tu endpoint real para obtener los platos
        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, []);

  const handleCheckIngredients = async (dishId, requiredIngredients) => {
    try {
      // Usamos `checkDishPreparation` para verificar si se puede preparar el plato
      const response = await canPrepareDish(requiredIngredients);
      const status = response.success ? "Hay" : "No hay";
      
      // Actualizar el estado con el resultado
      setIngredientsStatus((prevStatus) => ({
        ...prevStatus,
        [dishId]: status,
      }));
    } catch (error) {
      console.error("Error checking ingredients:", error);
      setIngredientsStatus((prevStatus) => ({
        ...prevStatus,
        [dishId]: "Error",
      }));
    }
  };

  return (
    <div>
      <h1>Chefsito</h1>
      <table>
        <thead>
          <tr>
            <th>Plato</th>
            <th>Ingredientes</th>
            <th>Disponibilidad</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish.id}>
              <td>{dish.nombre}</td>
              <td>
                {dish.ingredientes.map((ing) => (
                  <div key={ing.nombre}>{`${ing.nombre} - Cantidad Necesaria: ${ing.cantidadNecesaria}`}</div>
                ))}
              </td>
              <td>
                <button onClick={() => handleCheckIngredients(dish.id, dish.ingredientes)}>
                  Verificar
                </button>
                <span>{ingredientsStatus[dish.id]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Chefsito;
