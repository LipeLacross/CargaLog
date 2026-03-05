import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { treinoApi } from '../../api/treino.api';
import { Header } from '../../components/common/Header';
export function EditTreino() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    exercicioNome: '',
    carga: '',
    repeticoes: '',
    series: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      treinoApi
        .listar()
        .then((res) => {
          const treino = res.data.find((t: any) => t.id === id);
          if (treino) {
            setFormData({
              exercicioNome: treino.exercicioNome,
              carga: treino.carga,
              repeticoes: treino.repeticoes,
              series: treino.series,
            });
          }
        })
        .catch(() => setErro('Erro ao carregar treino'));
    }
  }, [id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await treinoApi.atualizar(id!, {
        ...formData,
        carga: Number(formData.carga),
        repeticoes: Number(formData.repeticoes),
        series: Number(formData.series),
      });
      navigate('/treinos');
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao atualizar treino');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Editar Treino</h1>
        <form onSubmit={handleSubmit} className="max-w-md space-y-6 bg-white p-8 rounded-lg shadow">
          <input
            type="text"
            name="exercicioNome"
            placeholder="Nome do exerc�cio"
            value={formData.exercicioNome}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="carga"
            placeholder="Carga (kg)"
            value={formData.carga}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="repeticoes"
            placeholder="Repeti��es"
            value={formData.repeticoes}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="series"
            placeholder="S�ries"
            value={formData.series}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Salvando...' : 'Salvar Treino'}
          </button>
        </form>
      </main>
    </>
  );
}
