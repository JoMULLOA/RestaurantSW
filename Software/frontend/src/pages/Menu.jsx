import { useState, useEffect } from 'react';
import '../styles/Menu.css';
import { getMenus, addMenu, deleteMenu } from '../services/menu.service';
import chefGif from '../assets/chef.gif';
import deleteI from '../assets/deleteIconDisabled.svg';
import infoI from '../assets/info.png';


const Menu = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuSections, setMenuSections] = useState({ platos: [], bebestibles: [], postres: [] });
    const [newMenu, setNewMenu] = useState({ nombre: '', ingredientes: [], precio: '', tipo: '' });
    const [newIngredient, setNewIngredient] = useState({ nombre: '', cantidad: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleAddMenu = async () => {
        try {
            const response = await addMenu(newMenu);
            setMenuSections(prevState => ({
                ...prevState,
                [newMenu.tipo.toLowerCase() + 's']: [...prevState[newMenu.tipo.toLowerCase() + 's'], response.data]
            }));
            setNewMenu({ nombre: '', ingredientes: [], precio: 1, tipo: '' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al agregar menú:', error);
        }
    };

    const handleAddIngredient = () => {
        setNewMenu(prevState => ({
            ...prevState,
            ingredientes: [...prevState.ingredientes, newIngredient]
        }));
        setNewIngredient({ nombre: '', cantidad: 1 });
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

    const handleMenuInfoClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="menu-container">
            <div className="marquee">
                <img src={chefGif} alt="Chef" className="chef" />
            </div>
            <h2>🧾 Menú del Restaurante 🍴</h2>
            <button className="add-menu-button" onClick={() => setIsModalOpen(true)}>Agregar Menú</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
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
                                required
                                min="1" // No permite números menores a 1
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
                                    required
                                    min="1"
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
                </div>
            )}

            <div className="menu-sections">
                <div className="menu-section">
                    <h3>Platos</h3>
                    <ul className="menu-list">
                        {menuSections.platos.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                            >
                                {item.nombre}
                                <div className="menu-item-buttons">
                                <img src={infoI} alt="Información" className="info-button" onClick={() => handleMenuInfoClick(item)} />
                                    <img src={deleteI} alt="Eliminar" className="delete-icon" onClick={() => handleDeleteMenu(item.id, 'Plato')} />
                                </div>
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
                            >
                                {item.nombre}
                                <div className="menu-item-buttons">
                                <img src={infoI} alt="Información" className="info-button" onClick={() => handleMenuInfoClick(item)} />
                                    <img src={deleteI} alt="Eliminar" className="delete-icon" onClick={() => handleDeleteMenu(item.id, 'Bebestible')} />
                                </div>
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
                            >
                                {item.nombre}
                                <div className="menu-item-buttons">
                                    <img src={infoI} alt="Información" className="info-button" onClick={() => handleMenuInfoClick(item)} />
                                    <img src={deleteI} alt="Eliminar" className="delete-icon" onClick={() => handleDeleteMenu(item.id, 'Postre')} />
                                </div>
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

        </div>
    );
};

export default Menu;