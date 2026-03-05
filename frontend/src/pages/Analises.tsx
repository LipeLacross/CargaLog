import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { analisesApi } from '../api/analise.api';
import { Header } from '../components/common/Header';
import { StatCard } from '../components/cards/StatCard';
export function Analises() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (usuario) {
      analisesApi
        .estatisticas()
        .then((res) => setStats(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [usuario]);
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">An�lises</h1>
        {loading ? (
          <p>Carregando an�lises...</p>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard titulo="Total Treinos" valor={stats.totalTreinos} cor="blue" />
              <StatCard titulo="Exerc�cios �nicos" valor={stats.exercicios?.length || 0} cor="green" />
              <StatCard titulo="Volume Total" valor={Math.round(stats.totalVolume || 0)} cor="purple" />
            </div>
            {stats.cargaMedia && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Carga M�dia</p>
                  <p className="text-3xl font-bold mt-2">{stats.cargaMedia.toFixed(1)}kg</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Carga M�xima</p>
                  <p className="text-3xl font-bold mt-2">{stats.cargaMaxima}kg</p>
                </div>
              </div>
            )}
            {stats.exercicios && stats.exercicios.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Exerc�cios</h2>
                <div className="space-y-2">
                  {stats.exercicios.map((ex: any, idx: number) => (
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
