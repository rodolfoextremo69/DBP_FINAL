import { useState, useEffect, Activity } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { api } from '../api';
import type { Activity , Page, ApiError } from '../api';

import Operaciones from '../componentes/Operaciones';
import OtroComponente from '../componentes/OtroComponente';

export default function ActivitiesPage() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {

    const fetchActivitys = async () => {

      setLoading(true);
      setError('');

      try {
        const response = await api.get<Page<Activity>>>(
          `/api/activities?page=${page}&size=5`
        );

        setActivities(response.data.items);
        setTotalPages(response.data.totalPages);

      } catch (err) {
        if (axios.isAxiosError<ApiError>(err)) {
          setError(
            err.response?.data?.message ?? 'Error al cargar juegos'
          );
        } else {
          setError('Error inesperado');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivitys();

  }, [page]);

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Listado de actividades
      </h1>

      {loading && (
        <p>Cargando actividades...</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && !error && activities.length === 0 && (
        <p>No hay actividades disponibles.</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {activities.map((activity) => (
            <Link
              key={activity.id}
              to={`/activities/${activity.id}`}
              className="hover:opacity-80"
            >
              <Operaciones activity={activity} />
            </Link>
          ))}

        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading || !!error || activities.length === 0}
      />

    </div>
  );
}