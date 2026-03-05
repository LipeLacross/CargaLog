import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { treinoApi } from '../../api/treino.api';
import { Header } from '../../components/common/Header';
import { useAuth } from '../../hooks/useAuth';
import { formatarCarga, formatarData } from '../../utils/formatters';

interface TreinoItem {
  id: string;
  exercicioNome: string;
  carga: number;
  repeticoes: number;
  data: string;
}

export function Treinos() {
  const { usuario } = useAuth();
  const [treinos, setTreinos] = useState<TreinoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) return;

    treinoApi
      .listar()
      .then((res) => setTreinos(res.data as TreinoItem[]))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [usuario]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar?')) return;

    try {
      await treinoApi.deletar(id);
      setTreinos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg = error.response?.data?.message || error.message;
      alert(`Erro ao deletar: ${errorMsg}`);
      console.error('Erro ao deletar treino:', err);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meus Treinos</h1>
          <button
            onClick={() => navigate('/treinos/novo')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            + Novo Treino
          </button>
        </div>

        {loading ? (
          <p>Carregando treinos...</p>
        ) : treinos.length === 0 ? (
          <p className="text-gray-500">Nenhum treino registrado</p>
        ) : (
          <div className="space-y-4">
            {treinos.map((treino) => (
              <div key={treino.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold">{treino.exercicioNome}</h3>
                <p className="text-gray-600">
                  {formatarCarga(treino.carga)}kg x {treino.repeticoes} reps
                </p>
                <p className="text-sm text-gray-500">
                  {formatarData(treino.data)}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/treinos/editar/${treino.id}`)}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(treino.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
