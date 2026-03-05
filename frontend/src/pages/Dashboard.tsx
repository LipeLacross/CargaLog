import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analisesApi } from '../api/analise.api';
import { treinoApi } from '../api/treino.api';
import { StatCard } from '../components/cards/StatCard';
import { Header } from '../components/common/Header';
import { useAuth } from '../hooks/useAuth';
import { formatarCarga, formatarData } from '../utils/formatters';
import { TrendingUp, Zap, Activity } from 'lucide-react';

interface DashboardStats {
  totalTreinos: number;
  exercicios: string[];
  exercicioMaisTreinado?: {
    nome: string;
    quantidade: number;
  };
}

interface TreinoItem {
  id: string;
  exercicioNome: string;
  carga: number;
  repeticoes: number;
  data: string;
}

interface ExercicioRecord {
  nome: string;
  maiorCarga: number;
  data: string;
}

export function Dashboard() {
  const { usuario, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [exercicioRecord, setExercicioRecord] = useState<ExercicioRecord[]>([]);
  const [ultimosTreinos, setUltimosTreinos] = useState<TreinoItem[]>([]);
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

    const fetchData = async () => {
      try {
        const statsRes = await analisesApi.estatisticas();
        setStats(statsRes.data as DashboardStats);

        const treinosRes = await treinoApi.listar();
        const treinosData = treinosRes.data as TreinoItem[];

        const recordMap = new Map<string, ExercicioRecord>();
        treinosData.forEach((treino) => {
          const nomeNormalizado = treino.exercicioNome.toLowerCase().trim();
          const cargaNum = Number(treino.carga);

          if (isNaN(cargaNum) || cargaNum <= 0) {
            return;
          }

          const existing = recordMap.get(nomeNormalizado);

          if (!existing || cargaNum > existing.maiorCarga) {
            recordMap.set(nomeNormalizado, {
              nome: treino.exercicioNome,
              maiorCarga: cargaNum,
              data: treino.data,
            });
          }
        });
        setExercicioRecord(Array.from(recordMap.values()).sort((a, b) => b.maiorCarga - a.maiorCarga));

        setUltimosTreinos(
          treinosData
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
            .slice(0, 5),
        );
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      }
    };

    fetchData();
  }, [usuario]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin">
          <Zap className="w-12 h-12 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Título com animação */}
          <div className="mb-12 animate-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Bem-vindo! 💪
            </h1>
            <p className="text-gray-600 text-lg">Acompanhe seu progresso de levantamento</p>
          </div>

          {/* Cards principais */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard
                titulo="Total Treinos"
                valor={stats.totalTreinos}
                cor="blue"
                icon={<Activity className="w-6 h-6" />}
              />
              <StatCard
                titulo="Exercícios"
                valor={stats.exercicios?.length || 0}
                cor="green"
                icon={<Zap className="w-6 h-6" />}
              />
              <StatCard
                titulo="Mais Treinado"
                valor={stats.exercicioMaisTreinado?.nome || '-'}
                subtitulo={`${stats.exercicioMaisTreinado?.quantidade}x`}
                cor="purple"
                icon={<TrendingUp className="w-6 h-6" />}
              />
            </div>
          )}

          {/* Maior Carga por Exercício */}
          {exercicioRecord.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-in border-t-4 border-blue-600">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Recordes por Exercício</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercicioRecord.slice(0, 6).map((record) => (
                  <div
                    key={record.nome}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 hover:shadow-lg transition-all hover:scale-105"
                  >
                    <p className="text-gray-700 text-sm mb-2">{record.nome}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-blue-600">{formatarCarga(record.maiorCarga)}</p>
                      <p className="text-xs text-gray-500">kg</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{formatarData(record.data)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Últimos Treinos */}
          {ultimosTreinos.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 animate-in border-t-4 border-green-600">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Últimos Treinos</h2>
              </div>
              <div className="space-y-3">
                {ultimosTreinos.map((treino, idx) => (
                  <div
                    key={treino.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:translate-x-1"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{treino.exercicioNome}</p>
                        <p className="text-sm text-gray-600">
                          {formatarCarga(treino.carga)}kg × {treino.repeticoes} reps
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{formatarData(treino.data)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/treinos')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Ver Todos os Treinos
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
