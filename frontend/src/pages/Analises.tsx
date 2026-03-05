import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analisesApi } from '../api/analise.api';
import { treinoApi } from '../api/treino.api';
import { StatCard } from '../components/cards/StatCard';
import { Header } from '../components/common/Header';
import { useAuth } from '../hooks/useAuth';
import { formatarCarga, formatarData } from '../utils/formatters';

interface EstatisticasResponse {
  totalTreinos: number;
  exercicios: string[];
  cargaMedia?: number;
  cargaMaxima?: number;
}

interface TreinoItem {
  id: string;
  exercicioNome: string;
  carga: number;
  repeticoes: number;
  data: string;
}

interface ExercicioStats {
  nome: string;
  total: number;
  maiorCarga: number;
  mediaCarga: number;
  dataUltimo: string;
}

export function Analises() {
  const { usuario, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<EstatisticasResponse | null>(null);
  const [exercicioStats, setExercicioStats] = useState<ExercicioStats[]>([]);
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

        // Buscar treinos para calcular stats por exercício
        const treinosRes = await treinoApi.listar();
        const treinos = treinosRes.data as TreinoItem[];

        // Agrupar por exercício (normalizar nomes para lowercase para evitar duplicatas)
        const statsMap = new Map<
          string,
          {
            nome: string;
            total: number;
            maiorCarga: number;
            somaCarga: number;
            dataUltimo: string;
          }
        >();

        treinos.forEach((treino) => {
          const nomeNormalizado = treino.exercicioNome.toLowerCase().trim();
          const cargaNum = Number(treino.carga); // Garantir que é número

          // Ignorar se carga inválida
          if (isNaN(cargaNum) || cargaNum <= 0) {
            console.warn('Carga inválida ignorada:', treino);
            return;
          }

          const existing = statsMap.get(nomeNormalizado);

          if (existing) {
            existing.total += 1;
            existing.maiorCarga = Math.max(existing.maiorCarga, cargaNum);
            existing.somaCarga += cargaNum;
            if (new Date(treino.data) > new Date(existing.dataUltimo)) {
              existing.dataUltimo = treino.data;
            }
          } else {
            statsMap.set(nomeNormalizado, {
              nome: treino.exercicioNome,
              total: 1,
              maiorCarga: cargaNum,
              somaCarga: cargaNum,
              dataUltimo: treino.data,
            });
          }
        });

        // Calcular média corretamente: soma de cargas / total de treinos
        const exerciciosComMedia: ExercicioStats[] = Array.from(statsMap.values()).map(
          (stat) => ({
            nome: stat.nome,
            total: stat.total,
            maiorCarga: stat.maiorCarga,
            mediaCarga: stat.total > 0 ? stat.somaCarga / stat.total : 0,
            dataUltimo: stat.dataUltimo,
          }),
        );

        setExercicioStats(
          exerciciosComMedia.sort((a, b) => b.total - a.total),
        );
      } catch (err) {
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };

        const errorMsg = error.response?.data?.message || error.message;
        console.error('Erro ao carregar analises:', errorMsg);

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
            {/* Cards principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatCard titulo="Total Treinos" valor={stats.totalTreinos} cor="blue" />
              <StatCard titulo="Exercicios Unicos" valor={stats.exercicios?.length || 0} cor="green" />
            </div>

            {/* Carga média e máxima */}
            {stats.cargaMedia && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Carga Media</p>
                  <p className="text-3xl font-bold mt-2">{formatarCarga(stats.cargaMedia)}kg</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Carga Maxima</p>
                  <p className="text-3xl font-bold mt-2">{formatarCarga(stats.cargaMaxima || 0)}kg</p>
                </div>
              </div>
            )}

            {/* Stats por exercício */}
            {exercicioStats.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Analise por Exercicio</h2>
                <div className="space-y-4">
                  {exercicioStats.map((ex) => (
                    <div key={ex.nome} className="p-4 bg-gray-50 rounded border-l-4 border-purple-500">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-lg">{ex.nome}</p>
                          <p className="text-sm text-gray-500">Ultimo: {formatarData(ex.dataUltimo)}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-semibold">
                          {ex.total}x
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Maior Carga</p>
                          <p className="text-2xl font-bold text-purple-600">{formatarCarga(ex.maiorCarga)}kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Media</p>
                          <p className="text-2xl font-bold text-blue-600">{formatarCarga(ex.mediaCarga)}kg</p>
                        </div>
                      </div>
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
