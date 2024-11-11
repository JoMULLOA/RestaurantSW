import { useState, useEffect } from 'react';
import '../styles/Menu.css';
import { getMenus, addMenu, deleteMenu } from '../services/menu.service';

const Menu = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuSections, setMenuSections] = useState({ platos: [], bebestibles: [], postres: [] });
    const [newMenu, setNewMenu] = useState({ nombre: '', ingredientes: [], precio: 0, tipo: '' });
    const [newIngredient, setNewIngredient] = useState({ nombre: '', cantidad: 0 });

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenus();
                const data = response.data;
                const platos = data.filter(item => item.tipo === 'Plato');
                const bebestibles = data.filter(item => item.tipo === 'Bebestible');
                const postres = data.filter(item => item.tipo === 'Postre');
                setMenuSections({ platos, bebestibles, postres });
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        fetchMenu();
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const handleAddMenu = async () => {
        try {
            const response = await addMenu(newMenu);
            setMenuSections(prevState => ({
                ...prevState,
                [newMenu.tipo.toLowerCase() + 's']: [...prevState[newMenu.tipo.toLowerCase() + 's'], response.data]
            }));
            setNewMenu({ nombre: '', ingredientes: [], precio: 0, tipo: '' });
        } catch (error) {
            console.error('Error adding menu:', error);
        }
    };

    const handleAddIngredient = () => {
        setNewMenu(prevState => ({
            ...prevState,
            ingredientes: [...prevState.ingredientes, newIngredient]
        }));
        setNewIngredient({ nombre: '', cantidad: 0 });
    };

    const handleDeleteMenu = async (menuId, menuType) => {
        try {
            await deleteMenu(menuId);
            setMenuSections(prevState => ({
                ...prevState,
                [menuType.toLowerCase() + 's']: prevState[menuType.toLowerCase() + 's'].filter(item => item.id !== menuId)
            }));
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    return (
        <div className="menu-container">
            <marquee><h2>🧾 Menú del Restaurante 🍴</h2></marquee>
            <div className="menu-sections">
                <div className="menu-section">
                    <h3>Platos</h3>
                    <ul className="menu-list">
                        {menuSections.platos.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.nombre}
                                <button className="delete-button" onClick={() => handleDeleteMenu(item.id, 'Plato')}>⛔</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="menu-section">
                    <h3>Bebestibles</h3>
                    <ul className="menu-list">
                        {menuSections.bebestibles.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.nombre}
                                <button className="delete-button" onClick={() => handleDeleteMenu(item.id, 'Bebestible')}>⛔</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="menu-section">
                    <h3>Postres</h3>
                    <ul className="menu-list">
                        {menuSections.postres.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.nombre}
                                <button className="delete-button" onClick={() => handleDeleteMenu(item.id, 'Postre')}>⛔</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {selectedItem && (
                <div className="selected-item-info">
                    <p>Seleccionaste: <strong>{selectedItem.nombre}</strong></p>
                    <h4 className="left-align">Sus ingredientes son:</h4>
                    <ul className="ingredients-list">
                        {selectedItem.ingredientes.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.nombre}: {ingredient.cantidad}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

<div className="add-menu-form">
                <h3>Agregar Nuevo Menú</h3>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={newMenu.nombre}
                    onChange={(e) => setNewMenu({ ...newMenu, nombre: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Tipo"
                    value={newMenu.tipo}
                    onChange={(e) => setNewMenu({ ...newMenu, tipo: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={newMenu.precio}
                    onChange={(e) => setNewMenu({ ...newMenu, precio: parseFloat(e.target.value) })}
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
                    />
                    <button onClick={handleAddIngredient}>Agregar Ingrediente</button>
                </div>
                <ul className="ingredients-list">
                    {newMenu.ingredientes.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.nombre}: {ingredient.cantidad}
                        </li>
                    ))}
                </ul>
                <button onClick={handleAddMenu}>Agregar Menú</button>
            </div>
        </div>
    );
};

export default Menu;