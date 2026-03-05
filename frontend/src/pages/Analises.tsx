import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analisesApi } from '../api/analise.api';
import { StatCard } from '../components/cards/StatCard';
import { Header } from '../components/common/Header';
import { useAuth } from '../hooks/useAuth';

interface EstatisticasResponse {
  totalTreinos: number;
  exercicios: string[];
  cargaMedia?: number;
  cargaMaxima?: number;
}

export function Analises() {
  const { usuario, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<EstatisticasResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !usuario) {
      navigate('/login');
      return;
    }

    if (!usuario) {
      return;
    }

    const fetchStats = async () => {
      setLoading(true);

      try {
        const res = await analisesApi.estatisticas();
        setStats(res.data);
      } catch (err) {
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };

        const errorMsg = error.response?.data?.message || error.message;
        console.error('Erro ao carregar estatisticas:', errorMsg);

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [usuario, authLoading, navigate]);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Analises</h1>
        {loading ? (
          <p>Carregando analises...</p>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatCard titulo="Total Treinos" valor={stats.totalTreinos} cor="blue" />
              <StatCard
                titulo="Exercicios Unicos"
                valor={stats.exercicios?.length || 0}
                cor="green"
              />
            </div>

            {stats.cargaMedia && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Carga Media</p>
                  <p className="text-3xl font-bold mt-2">{stats.cargaMedia.toFixed(1)}kg</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Carga Maxima</p>
                  <p className="text-3xl font-bold mt-2">{stats.cargaMaxima}kg</p>
                </div>
              </div>
            )}

            {stats.exercicios && stats.exercicios.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Exercicios</h2>
                <div className="space-y-2">
                  {stats.exercicios.map((ex: string, idx: number) => (
                    <div key={idx} className="flex justify-between border-b pb-2">
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </>
  );
}
