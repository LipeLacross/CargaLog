import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analisesApi } from '../api/analise.api';
import { Header } from '../components/common/Header';
import { StatCard } from '../components/cards/StatCard';

interface EstatisticasResponse {
  totalTreinos: number;
  exercicios: string[];
  totalVolume: number;
  cargaMedia?: number;
  cargaMaxima?: number;
}

export function Analises() {
  const { usuario, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<EstatisticasResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redireciona se não autenticado
    if (!authLoading && !usuario) {
      console.warn('❌ Usuário não autenticado. Redirecionando para login...');
      navigate('/login');
      return;
    }

    // Carrega se tiver usuário autenticado
    if (!usuario) {
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      console.log('🔍 Carregando estatísticas para usuário:', usuario.id);
      console.log(
        '🔑 Token no localStorage:',
        localStorage.getItem('token')
          ? `${localStorage.getItem('token')?.substring(0, 20)}...`
          : 'NENHUM',
      );

      try {
        const res = await analisesApi.estatisticas();
        console.log('✅ Estatísticas carregadas:', res.data);
        setStats(res.data);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        const errorMsg =
          (error.response?.data?.message as string) || (error.message as string);
        console.error('❌ Erro ao carregar estatísticas:', errorMsg);

        // Se erro 401, redireciona para login
        if (error.response?.status === 401) {
          console.warn('⚠️ Token inválido. Redirecionando para login...');
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
                <h2 className="text-xl font-bold mb-4">Exercícios</h2>
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
