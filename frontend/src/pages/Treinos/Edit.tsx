import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { treinoApi } from '../../api/treino.api';
import { Header } from '../../components/common/Header';
import { STRENGTH_EXERCISE_OPTIONS } from './exerciseOptions';

interface TreinoItem {
  id: string;
  exercicioNome: string;
  carga: number;
  repeticoes: number;
  data: string;
}

interface EditTreinoFormData {
  exercicioNome: string;
  carga: string;
  repeticoes: string;
  data: string;
}

export function EditTreino() {
  const { id } = useParams();
  const [formData, setFormData] = useState<EditTreinoFormData>({
    exercicioNome: '',
    carga: '',
    repeticoes: '',
    data: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    treinoApi
      .listar()
      .then((res) => {
        const treino = (res.data as TreinoItem[]).find((t) => t.id === id);

        if (treino) {
          // Converter data para formato YYYY-MM-DD
          const dataFormatada = new Date(treino.data)
            .toISOString()
            .split('T')[0];

          setFormData({
            exercicioNome: treino.exercicioNome,
            carga: String(treino.carga),
            repeticoes: String(treino.repeticoes),
            data: dataFormatada,
          });
        }
      })
      .catch(() => setErro('Erro ao carregar treino'));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await treinoApi.atualizar(id!, {
        exercicioNome: formData.exercicioNome,
        carga: Number(formData.carga),
        repeticoes: Number(formData.repeticoes),
        data: formData.data,
      });
      navigate('/treinos');
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
      };
      setErro(error.response?.data?.message || 'Erro ao atualizar treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Editar Treino</h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-md space-y-6 bg-white p-8 rounded-lg shadow"
        >
          <select
            name="exercicioNome"
            value={formData.exercicioNome}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Selecione o exercicio</option>
            {STRENGTH_EXERCISE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="carga"
            placeholder="Carga (kg)"
            value={formData.carga}
            onChange={handleChange}
            step="0.5"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="number"
            name="repeticoes"
            placeholder="Repeticoes"
            value={formData.repeticoes}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">Data do Treino</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

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
