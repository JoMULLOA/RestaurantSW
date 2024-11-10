import { useState, useEffect } from 'react';
import '../styles/Menu.css';
import { getMenus } from '../services/menu.service';

const Menu = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuSections, setMenuSections] = useState({ platos: [], bebestibles: [], postres: [] });
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
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;