import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";
import chefs from '../assets/chefso.svg';
import waiter from '../assets/waiter.svg';
import admin from '../assets/admin.svg';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const NombreS = user?.nombreCompleto;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            removeActiveClass();
        } else {
            addActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    const addActiveClass = () => {
        const links = document.querySelectorAll('.nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    // Condicional para añadir la clase `solo-chef` si el rol es solo 'chef'
    const navClass = `nav-menu ${menuOpen ? 'activado' : ''} ${userRole === 'chef' ? 'solo-chef' : ''}`;

    return (
        <nav className="navbar">
            <div className={navClass}>
                <ul>
                    <li>
                        <NavLink 
                            to="/home" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Inicio
                        </NavLink>
                    </li>
                    {userRole === 'administrador' && (
                        <>
                            <div className="user-role-indicator">
                                <img src={admin} alt="admin" className="user-role-icon" />
                                <span className="user-role-text">Administrador</span>
                            </div>
                            <li>
                                <NavLink 
                                    to="/users" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/Register" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                    }} 
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                >
                                    Registrar
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/Inventario" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                >
                                    Inventario
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'chef' && (
                        <>
                            <div className="user-role-indicator">
                                <img src={chefs} alt="chef" className="user-role-icon" />
                                <span className="user-role-text">
                                    Chef - {NombreS}
                                </span>
                            </div>
                            <li>
                                <NavLink 
                                    to="/Chef" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                >
                                    Chef
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'garzon' && (
                        <>  
                            <div className="user-role-indicator">
                                <img src={waiter} alt="waiter" className="user-role-icon" />
                                <span className="user-role-text">Garzón</span>
                            </div>
                            <li>
                                <NavLink 
                                    to="/pedido" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                >
                                    Pedido
                                </NavLink>
                            </li>
                        </>
                    )}
                    {/* Mostrar el enlace "Mesas" para los roles "administrador" y "garzon" */}
                    {(userRole === 'administrador' ) && (
                        <li>
                            <NavLink 
                                to="/mesas" 
                                onClick={() => { 
                                    setMenuOpen(false); 
                                    addActiveClass();
                                }} 
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Mesas
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink 
                            to="/menu" 
                            onClick={() => { 
                                setMenuOpen(false); 
                            }} 
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Menú
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/auth" 
                            onClick={() => { 
                                logoutSubmit(); 
                                setMenuOpen(false); 
                            }} 
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;