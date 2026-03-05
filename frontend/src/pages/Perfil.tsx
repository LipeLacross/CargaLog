import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { Header } from '../components/common/Header';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Mail, Save } from 'lucide-react';

export function Perfil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    setNome(usuario.nome || '');
  }, [usuario, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!nome.trim()) {
      setErro('Nome não pode estar vazio');
      return;
    }

    if (novaSenha || senhaAtual) {
      if (!senhaAtual) {
        setErro('Digite sua senha atual para alterar a senha');
        return;
      }

      if (novaSenha !== confirmarSenha) {
        setErro('As novas senhas não conferem');
        return;
      }

      if (novaSenha.length < 8) {
        setErro('Nova senha deve ter no mínimo 8 caracteres');
        return;
      }
    }

    setLoading(true);

    try {
      await authApi.atualizarPerfil({
        nome: nome.trim(),
        senhaAtual: senhaAtual || undefined,
        novaSenha: novaSenha || undefined,
      });

      setSucesso('Perfil atualizado com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

      // Recarregar perfil após 2 segundos
      setTimeout(() => setSucesso(''), 2000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErro(error.response?.data?.message || error.message || 'Erro ao atualizar');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-2xl p-8 animate-in">
            <div className="flex items-center gap-3 mb-8">
              <User className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Meu Perfil</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email (apenas exibição) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <div className="p-4 bg-gray-100 rounded-lg text-gray-700">
                  {usuario.email}
                </div>
                <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado</p>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                />
              </div>

              {/* Divisor */}
              <hr className="border-gray-200" />

              {/* Alteração de Senha */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Alterar Senha (Opcional)
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite sua senha atual"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mínimo 8 caracteres"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Repita a nova senha"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              {erro && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{erro}</p>
                </div>
              )}

              {sucesso && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">✅ {sucesso}</p>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  disabled={loading}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
