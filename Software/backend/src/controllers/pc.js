import db from "../config/db.js";

// Verificar si todos los ingredientes están disponibles para el pedido
export const verificarInventario = async (req, res) => {
  const { pedidoId, ingredientes } = req.body; // Recibe el pedido y sus ingredientes
  try {
    // Verifica cada ingrediente en el inventario
    const faltantes = [];
    for (const ingrediente of ingredientes) {
      const { rows } = await db.query("SELECT cantidad FROM inventario WHERE nombre = $1", [ingrediente.nombre]);
      if (rows.length === 0 || rows[0].cantidad < ingrediente.cantidad) {
        faltantes.push(ingrediente.nombre);
      }
    }

    if (faltantes.length > 0) {
      // Si faltan ingredientes, responde con el listado de faltantes
      return res.json({ status: "Faltan ingredientes", faltantes });
    }

    // Si todos los ingredientes están disponibles, responde afirmativamente
    res.json({ status: "Ingredientes disponibles" });
  } catch (error) {
    console.error("Error al verificar inventario:", error);
    res.status(500).json({ message: "Error al verificar inventario" });
  }
};
