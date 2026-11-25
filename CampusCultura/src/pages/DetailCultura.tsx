import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import { api } from '../api';
import type { activities, ApiError } from '../api';

import Operaciones from '../componentes/Operaciones';

export default function DetailCultura() {

  const { id } = useParams();

  // Estados del detalle
  const [activities, setActivities] = useState<Activities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados del préstamo
  const [days, setDays] = useState('');
  const [loanError, setLoanError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Consultar el detalle de la actividad
  useEffect(() => {

    const fetchActivities = async () => {

      setLoading(true);
      setError('');
      setActivities(null);
      setLoanError('');
      setSuccess('');

      try {
        const response = await api.get<Activities>(
          `/api/activities/${id}`
        );

        setActivities(response.data);

      } catch (err) {
        if (axios.isAxiosError<ApiError>(err)) {
          setError(
            err.response?.data?.message ?? 'Error a'
          );
        } else {
          setError('Error inesperado');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

  }, [id]);

  // Enviar la solicitud de préstamo
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setLoanError('');
    setSuccess('');

    const numberDays = Number(days);

    // Validar los días
    if (
      !Number.isInteger(numberDays) ||
      numberDays < 1 ||
      numberDays > 3
    ) {
      setLoanError('Ingrese un número entero entre 1 y 3 días.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post<{
        activitiesId: number;
        days: number;
        availableUnits: number;
      }>(
        `/api/activities/${id}/loans`,
        {
          days: numberDays,
        }
      );

      // Actualizar las unidades disponibles
      setActivities((previousActivities) =>
        previousActivities
          ? {
              ...previousActivities,
              availableUnits: response.data.availableUnits,
            }
          : null
      );

      setSuccess('Préstamo realizado correctamente.');
      setDays('');

    } catch (err) {

      if (axios.isAxiosError<ApiError>(err)) {

        if (
          err.response?.status === 409 &&
          err.response.data?.code === 'OUT_OF_STOCK'
        ) {
          setLoanError(
            'El se quedó disponibles.'
          );
        } else {
          setLoanError(
            err.response?.data?.message ?? 'Error al solicitar '
          );
        }

      } else {
        setLoanError('Error inesperado');
      }

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      <Link to="/activities" className="text-blue-600">
        Volver al listado
      </Link>

      <h1 className="text-3xl font-bold">
        Detalle de la actividad
      </h1>

      {loading && (
        <p>Cargando actividad...</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && !error && activities && (
        <>

          <Operaciones activities={activities} />

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white border rounded shadow p-4 space-y-4"
          >

            <h2 className="text-xl font-bold">
              Solicitar préstamo
            </h2>

            <div>
              <label htmlFor="days">
                Duración del préstamo (días)
              </label>

              <input
                id="days"
                type="number"
                min={1}
                max={3}
                step={1}
                required
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full border rounded p-2"
              />

              {loanError && (
                <p className="text-red-600 mt-2">
                  {loanError}
                </p>
              )}
            </div>

            {success && (
              <p className="text-green-600">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {submitting ? 'Enviando...' : 'Solicitar préstamo'}
            </button>

          </form>

        </>
      )}

    </div>
  );
}
