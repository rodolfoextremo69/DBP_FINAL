import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api';
import type { ApiError } from '../api';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);

      navigate('/games');

    } catch (err) {
      if (axios.isAxiosError<ApiError>(err)) {
        setError(
          err.response?.data?.message ?? 'Error al iniciar sesión'
        );
      } else {
        setError('Error inesperado');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96 space-y-4"
      >

        <h1 className="text-2xl font-bold">
          Inicio de sesión
        </h1>

        <div>
          <label htmlFor="email">Correo</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-2"
        >
          Iniciar sesión
        </button>

        <p>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-600">
            Registrarse
          </Link>
        </p>

      </form>

    </div>
  );
}