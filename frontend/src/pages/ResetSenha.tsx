import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export function ResetSenha() {
  const [searchParams] = useSearchParams();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!token) {
      setErro('Token inválido');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('Senhas não conferem');
      return;
    }

    if (novaSenha.length < 8) {
      setErro('Mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authApi.confirmarResetSenha({ token, novaSenha });
      setSucesso(true);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErro(error.response?.data?.message || 'Erro ao resetar');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sucesso! ✅</h2>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Link Inválido</h2>
          <Link to="/esqueci-senha" className="w-full block bg-blue-600 text-white py-2 rounded-lg">
            Novo Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Nova Senha</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nova senha"
            disabled={loading}
            required
          />

          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Confirmar"
            disabled={loading}
            required
          />

          {erro && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{erro}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Redefinindo...' : 'Redefinir'}
          </button>
        </form>
      </div>
    </div>
  );
}
