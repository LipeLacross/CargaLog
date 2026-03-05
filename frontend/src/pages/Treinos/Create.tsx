import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { treinoApi } from '../../api/treino.api';
import { Header } from '../../components/common/Header';
import { STRENGTH_EXERCISE_OPTIONS } from './exerciseOptions';

interface CreateTreinoFormData {
  exercicioNome: string;
  carga: string;
  repeticoes: string;
}

export function CreateTreino() {
  const [formData, setFormData] = useState<CreateTreinoFormData>({
    exercicioNome: '',
    carga: '',
    repeticoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

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
      await treinoApi.criar({
        exercicioNome: formData.exercicioNome,
        carga: Number(formData.carga),
        repeticoes: Number(formData.repeticoes),
      });
      navigate('/treinos');
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
      };
      setErro(error.response?.data?.message || 'Erro ao criar treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Novo Treino</h1>
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

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Criando...' : 'Criar Treino'}
          </button>
        </form>
      </main>
    </>
  );
}
