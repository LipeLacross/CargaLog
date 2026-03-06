import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth.api';

export function PerfilScreen({ navigation }: any) {
  const { usuario } = useAuth();
  const [nome, setNome] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
    }
  }, [usuario]);

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Nome não pode estar vazio');
      return;
    }

    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    if (novaSenha && novaSenha.length < 8) {
      Alert.alert('Erro', 'Nova senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authApi.atualizarPerfil({
        nome: nome.trim(),
        senhaAtual: senhaAtual || undefined,
        novaSenha: novaSenha || undefined,
      });

      Alert.alert('Sucesso', 'Perfil atualizado!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao atualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 py-6">
        <Text className="text-white text-2xl font-bold">👤 Meu Perfil</Text>
      </View>

      <View className="px-6 py-8">

        {/* Email */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <View className="bg-gray-100 px-4 py-3 rounded-lg">
            <Text className="text-gray-700">{usuario?.email}</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1">Email não pode ser alterado</Text>
        </View>

        {/* Nome */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Nome</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        {/* Divisor */}
        <View className="h-1 bg-gray-200 my-6" />

        {/* Alterar Senha */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">🔐 Alterar Senha (Opcional)</Text>

          <Text className="text-sm font-medium text-gray-700 mb-2">Senha Atual</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white mb-4"
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry
            editable={!loading}
            placeholderTextColor="#999"
          />

          <Text className="text-sm font-medium text-gray-700 mb-2">Nova Senha</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white mb-4"
            placeholder="Mínimo 8 caracteres"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            editable={!loading}
            placeholderTextColor="#999"
          />

          <Text className="text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="Repita a nova senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        {/* Botões */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={loading}
            className="flex-1 border border-gray-300 py-3 rounded-lg"
          >
            <Text className="text-gray-700 font-semibold text-center">Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSalvar}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg flex-row justify-center items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-center">Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

