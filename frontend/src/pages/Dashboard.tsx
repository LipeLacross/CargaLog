import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analisesApi } from '../api/analise.api';
import { StatCard } from '../components/cards/StatCard';
import { Header } from '../components/common/Header';
import { useAuth } from '../hooks/useAuth';

interface DashboardStats {
  totalTreinos: number;
  exercicios: string[];
  exercicioMaisTreinado?: {
    nome: string;
    quantidade: number;
  };
}

export function Dashboard() {
  const { usuario, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !usuario) {
      navigate('/login');
    }
  }, [loading, usuario, navigate]);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await analisesApi.estatisticas();
        setStats(res.data as DashboardStats);
      } catch (err) {
        const error = err as {
          response?: { data?: unknown };
          message?: string;
        };
        console.error(
          'Erro ao carregar estatisticas:',
          error.response?.data || error.message,
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [usuario]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        {statsLoading ? (
          <p>Carregando estatisticas...</p>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatCard titulo="Total Treinos" valor={stats.totalTreinos} cor="blue" />
              <StatCard titulo="Exercicios" valor={stats.exercicios?.length || 0} cor="green" />
            </div>
            {stats.exercicioMaisTreinado && (
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-bold mb-2">Exercicio Mais Treinado</h2>
                <p className="text-lg">
                  {stats.exercicioMaisTreinado.nome} ({stats.exercicioMaisTreinado.quantidade}x)
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/treinos')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Ver Treinos
            </button>
          </>
        ) : null}
      </main>
    </>
  );
}
