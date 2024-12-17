// Modal.jsx
import '../styles/Menu.css';


const AddMenuModal = ({
    isOpen,
    onClose,
    newMenu,
    setNewMenu,
    newIngredient,
    setNewIngredient,
    handleAddIngredient,
    handleAddMenu,
    noNegative,
}) => {
    if (!isOpen) return null;

    const handleRemoveFromArray = (field, index) => {
        setNewMenu((prevMenu) => ({
          ...prevMenu,
          ingredientes: prevMenu.ingredientes.filter((_, i) => i !== index),
        }));
      };
      

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="add-menu-form">
                    <h3>Agregar Nuevo Menú</h3>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={newMenu.nombre}
                        onChange={(e) => setNewMenu({ ...newMenu, nombre: e.target.value })}
                    />
                    <select
                        className="form-control"
                        value={newMenu.tipo}
                        onChange={(e) => setNewMenu({ ...newMenu, tipo: e.target.value })}
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="Plato">Plato</option>
                        <option value="Bebestible">Bebestible</option>
                        <option value="Postre">Postre</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Precio"
                        value={newMenu.precio}
                        onChange={(e) => setNewMenu({ ...newMenu, precio: parseFloat(e.target.value) })}
                        onInput={noNegative}
                        required
                    />
                    <div className="add-ingredient-form">
                        <h4>Agregar Ingrediente</h4>
                        <input
                            type="text"
                            placeholder="Nombre del Ingrediente"
                            value={newIngredient.nombre}
                            onChange={(e) => setNewIngredient({ ...newIngredient, nombre: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={newIngredient.cantidad}
                            onChange={(e) => setNewIngredient({ ...newIngredient, cantidad: parseFloat(e.target.value) })}
                            onInput={noNegative}
                            required
                        />
                        <button onClick={handleAddIngredient}>Agregar Ingrediente</button>
                    </div>
                    <ul>
                    {newMenu.ingredientes.map((item, index) => (
                        <li 
                        key={index} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', // Alinea verticalmente los elementos
                            justifyContent: 'space-between', // Espacio uniforme entre el texto y el botón
                        }}
                        >
                        <span style={{ flex: 1 }}>{item.nombre} - {item.cantidad}</span> {/* Texto alineado */}
                        <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleRemoveFromArray('ingredientes', index)}
                            style={{
                            marginLeft: '5px', // Reduce el margen izquierdo para acercarlo al texto
                            padding: '2px 5px',
                            fontSize: '12px',
                            height: '20px',
                            width: '20px',
                            display: 'flex',
                            justifyContent: 'center', // Centra la "X" horizontalmente
                            alignItems: 'center',    // Centra la "X" verticalmente
                            }}
                        >
                            X
                        </button>
                        </li>

                    ))}
                    </ul>
                    <button onClick={handleAddMenu}>Agregar Menú</button>
                </div>
            </div>
        </div>
    );
};

export default AddMenuModal;
