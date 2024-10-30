import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Chef from '@pages/Chef';
import Garzon from '@pages/Garzon';
import '@styles/styles.css';
import Inventario from '@pages/Inventario';
import Menu from '@pages/Menu';
<<<<<<< Updated upstream

=======
import Chefsito from './pages/chefsito';
import Mesas from './pages/Mesas'; // Importa el componente Mesas
>>>>>>> Stashed changes

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/Menu',
        element: <Menu />
      },
      {
        path: '/Chef',
        element: (
<<<<<<< Updated upstream
        <ProtectedRoute allowedRoles={['chef']}>
        <Chef />
      </ProtectedRoute>)
      }
      ,
=======
          <ProtectedRoute allowedRoles={['chef']}>
            <Chef />
          </ProtectedRoute>
        )
      },
      {
        path: '/chefsito',
        element: (
          <ProtectedRoute allowedRoles={['chef']}>
            <Chefsito />
          </ProtectedRoute>
        )
      },
>>>>>>> Stashed changes
      {
        path: '/Garzon',
        element: (
          <ProtectedRoute allowedRoles={['garzon']}>
            <Garzon />
          </ProtectedRoute>
        )
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        )
      },
      {
        path: '/inventario',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Inventario />
          </ProtectedRoute>
        )
      },
      {
        path: '/register',
        element: <Register />
      },
      // Nueva ruta para Mesas, accesible para roles 'administrador' y 'garzon'
      {
        path: '/mesas',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'garzon']}>
            <Mesas />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/auth',
    element: <Login />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
