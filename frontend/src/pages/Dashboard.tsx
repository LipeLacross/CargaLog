import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analisesApi } from '../api/analise.api';
import { Header } from '../components/common/Header';
import { StatCard } from '../components/cards/StatCard';
export function Dashboard() {
  const { usuario, loading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !usuario) {
      navigate('/login');
    }
  }, [loading, usuario, navigate]);
  useEffect(() => {
    if (usuario) {
      analisesApi
        .estatisticas()
        .then((res) => setStats(res.data))
        .catch((err) => console.error(err))
        .finally(() => setStatsLoading(false));
    }
  }, [usuario]);
  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        {statsLoading ? (
          <p>Carregando estat�sticas...</p>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard titulo="Total Treinos" valor={stats.totalTreinos} cor="blue" />
              <StatCard titulo="Exerc�cios" valor={stats.exercicios?.length || 0} cor="green" />
              <StatCard titulo="Volume Total" valor={Math.round(stats.totalVolume || 0)} cor="purple" />
            </div>
            {stats.exercicioMaisTreinado && (
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-bold mb-2">Exerc�cio Mais Treinado</h2>
                <p className="text-lg">{stats.exercicioMaisTreinado.nome} ({stats.exercicioMaisTreinado.quantidade}x)</p>
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
