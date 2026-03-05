import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analisesApi } from '../api/analise.api';
import { treinoApi } from '../api/treino.api';
import { StatCard } from '../components/cards/StatCard';
import { Header } from '../components/common/Header';
import { useAuth } from '../hooks/useAuth';
import { formatarCarga, formatarData } from '../utils/formatters';

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
        // Buscar estatísticas
        const statsRes = await analisesApi.estatisticas();
        setStats(statsRes.data as DashboardStats);

        // Buscar todos os treinos
        const treinosRes = await treinoApi.listar();
        const treinosData = treinosRes.data as TreinoItem[];

        // Calcular maior carga por exercício (normalizar nomes)
        const recordMap = new Map<string, ExercicioRecord>();
        treinosData.forEach((treino) => {
          const nomeNormalizado = treino.exercicioNome.toLowerCase().trim();
          const cargaNum = Number(treino.carga);

          // Ignorar se carga inválida
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

        // Últimos 5 treinos
        setUltimosTreinos(
          treinosData
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
            .slice(0, 5),
        );
      } catch (err) {
        const error = err as {
          response?: { data?: unknown };
          message?: string;
        };
        console.error(
          'Erro ao carregar dashboard:',
          error.response?.data || error.message,
        );
      }
    };

    fetchData();
  }, [usuario]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Cards principais */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard titulo="Total Treinos" valor={stats.totalTreinos} cor="blue" />
            <StatCard titulo="Exercicios" valor={stats.exercicios?.length || 0} cor="green" />
          </div>
        )}

        {/* Exercício mais treinado */}
        {stats?.exercicioMaisTreinado && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-2">Exercicio Mais Treinado</h2>
            <p className="text-lg">
              {stats.exercicioMaisTreinado.nome} ({stats.exercicioMaisTreinado.quantidade}x)
            </p>
          </div>
        )}

        {/* Records por exercício */}
        {exercicioRecord.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Maior Carga por Exercicio</h2>
            <div className="space-y-3">
              {exercicioRecord.map((record) => (
                <div
                  key={record.nome}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded border-l-4 border-blue-500"
                >
                  <div>
                    <p className="font-semibold">{record.nome}</p>
                    <p className="text-sm text-gray-500">{formatarData(record.data)}</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{formatarCarga(record.maiorCarga)}kg</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Últimos treinos */}
        {ultimosTreinos.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Ultimos Treinos</h2>
            <div className="space-y-3">
              {ultimosTreinos.map((treino) => (
                <div
                  key={treino.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded border-l-4 border-green-500"
                >
                  <div>
                    <p className="font-semibold">{treino.exercicioNome}</p>
                    <p className="text-sm text-gray-500">
                      {formatarCarga(treino.carga)}kg × {treino.repeticoes} reps • {formatarData(treino.data)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/treinos')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Ver Todos os Treinos
        </button>
      </main>
    </>
  );
}
