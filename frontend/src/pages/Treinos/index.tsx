import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { treinoApi } from '../../api/treino.api';
import { Header } from '../../components/common/Header';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { formatarCarga, formatarData } from '../../utils/formatters';
import { Trash2, Edit3, Plus, Calendar, Zap, Copy } from 'lucide-react';

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
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    treinoIdToDelete?: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) return;

    treinoApi
      .listar()
      .then((res) => setTreinos(res.data as TreinoItem[]))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [usuario]);

  const handleDeleteClick = (id: string, nome: string) => {
    setModal({
      isOpen: true,
      type: 'warning',
      title: '🗑️ Deletar Treino?',
      message: `Tem certeza que deseja deletar "${nome}"? Esta ação não pode ser desfeita.`,
      treinoIdToDelete: id,
    });
  };

  const handleConfirmDelete = async () => {
    if (!modal.treinoIdToDelete) return;

    try {
      await treinoApi.deletar(modal.treinoIdToDelete);
      setTreinos((prev) => prev.filter((t) => t.id !== modal.treinoIdToDelete));

      setModal({
        isOpen: true,
        type: 'success',
        title: '✅ Sucesso!',
        message: 'Treino deletado com sucesso.',
      });

      setTimeout(() => {
        setModal({ isOpen: false, type: 'info', title: '', message: '' });
      }, 2000);
    } catch (err) {
      const error = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido';

      setModal({
        isOpen: true,
        type: 'error',
        title: '❌ Erro ao Deletar',
        message: errorMsg,
      });
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header com titulo e botao */}
          <div className="flex items-center justify-between mb-12">
            <div className="animate-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Meus Treinos 💪
              </h1>
              <p className="text-gray-600">Registre e acompanhe seus treinos</p>
            </div>
            <button
              onClick={() => navigate('/treinos/novo')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Novo Treino
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin">
                <Zap className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          ) : treinos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <Copy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold mb-4">Nenhum treino registrado</p>
              <p className="text-gray-400 mb-6">Comece registrando seu primeiro treino!</p>
              <button
                onClick={() => navigate('/treinos/novo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Registrar Treino
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {treinos.map((treino, idx) => (
                <div
                  key={treino.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-102 p-6 border-l-4 border-blue-600 animate-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    {/* Exercício Info */}
                    <div className="flex-1 flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{treino.exercicioNome}</h3>
                        <div className="flex items-center gap-4 mt-2 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            {formatarCarga(treino.carga)}kg
                          </span>
                          <span className="flex items-center gap-1">
                            <Copy className="w-4 h-4 text-purple-500" />
                            {treino.repeticoes} reps
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-green-500" />
                            {formatarData(treino.data)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/treinos/editar/${treino.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(treino.id, treino.exercicioNome)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ isOpen: false, type: 'info', title: '', message: '' })}
        onConfirm={modal.type === 'warning' ? handleConfirmDelete : undefined}
        confirmText={modal.type === 'warning' ? 'Deletar' : undefined}
        cancelText={modal.type === 'warning' ? 'Cancelar' : 'Fechar'}
        showConfirmButton={modal.type === 'warning'}
      />
    </>
  );
}
