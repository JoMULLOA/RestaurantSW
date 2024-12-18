import { useState, useEffect } from 'react';
import '../styles/Menu.css';
import AddMenuModal from '../components/ModalMenu.jsx';
import { getMenus, addMenu, deleteMenu } from '../services/menu.service';
import chefGif from '../assets/chef.gif';
import deleteI from '../assets/deleteIconDisabled.svg';
import infoI from '../assets/info.png';
import AlertMessage from '../components/AlertMessage.jsx';


const Menu = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuSections, setMenuSections] = useState({ platos: [], bebestibles: [], postres: [] });
    const [newMenu, setNewMenu] = useState({ nombre: '', ingredientes: [], precio: '', tipo: '' });
    const [newIngredient, setNewIngredient] = useState({ nombre: '', cantidad: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });

    const noNegative = (e) => {
        if (e.target.value < 0) {
            e.target.value = 1;
        }
    };

    useEffect(() => {
        if (alert.message) {
            const timer = setTimeout(() => {
                setAlert({ message: '', type: '' });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [alert]);

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
            if (!newMenu.nombre || newMenu.nombre === '') {
                setAlert({
                    message: 'Por favor ingrese un nombre para el menú',
                    type: 'error'
                });
                return;
            }
            if (!newMenu.tipo || newMenu.tipo === '') {
                setAlert({
                    message: 'Por favor seleccione un tipo para el menú',
                    type: 'error'
                });
                return;
            }
            if (!newMenu.precio || newMenu.precio === '') {
                setAlert({
                    message: 'Por favor ingrese un precio para el menú',
                    type: 'error'
                });
                return;
            }
            if (!newMenu.ingredientes || newMenu.ingredientes.length === 0) {
                setAlert({
                    message: 'Por favor agregue al menos un ingrediente',
                    type: 'error'
                });
                return;
            }
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

    const validateIngredient = (ingredient) => {
        const isDuplicate = newMenu.ingredientes.some(
            ing => ing.nombre.toLowerCase() === ingredient.nombre.toLowerCase()
        );
    
        if (isDuplicate) {
            setAlert({
                message: 'Este ingrediente ya existe en el menú',
                type: 'error'
            });
            return false;
        }
        if (!ingredient.nombre || ingredient.nombre === '') {
            setAlert({
                message: 'Por favor ingrese un nombre para el ingrediente',
                type: 'error'
            });
            return false;
        }
        if (!ingredient.cantidad || ingredient.cantidad === '') {
            setAlert({
                message: 'Por favor ingrese una cantidad para el ingrediente',
                type: 'error'
            });
            return false;
        }
        return true;
    };

    const handleAddIngredient = () => {
        if (!validateIngredient(newIngredient)) return;
        
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
            console.error('Error al eliminar menu:', error);
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
            {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

            <AddMenuModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newMenu={newMenu}
                setNewMenu={setNewMenu}
                newIngredient={newIngredient}
                setNewIngredient={setNewIngredient}
                handleAddIngredient={handleAddIngredient}
                handleAddMenu={handleAddMenu}
                noNegative={noNegative}
                />
                
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