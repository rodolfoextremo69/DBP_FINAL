import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate
} from 'react-router-dom';

import RegisterCultura from './pages/RegisterCultura';
import LoginCultura from './pages/LoginCultura';
import ActivitiesPage from './pages/ActivitiesPage';
import DetailCultura from './pages/DetailCultura';

// Componente para proteger las rutas
function ProtectedLayout() {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="flex justify-between items-center bg-white p-4 shadow">

        <h1 className="font-bold">
          Lista de Actividades
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>

      </header>

      <main className="p-6">
        <Outlet />
      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}

        <Route path="/register" element={<RegisterCultura />} />

        <Route path="/login" element={<LoginCultura />} />

        {/* Rutas protegidas */}

        <Route element={<ProtectedLayout />}>

          <Route path="/activities" element={<ActivitiesPage />} />

          <Route path="/activities/:id" element={<DetailCultura />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
