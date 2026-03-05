import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      setErro('Email e senha são obrigatórios');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await login(email, senha);
      navigation.navigate('Dashboard');
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
      <View className="flex-1 justify-center px-6 py-12">
        {/* Título */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-blue-600">CargaLog</Text>
          <Text className="text-gray-600 text-base mt-2">Rastreie sua progressão de carga</Text>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        {/* Senha */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Senha</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
            placeholder="••••••••"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!loading}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
            <Text className="text-xs text-blue-600 mt-2 font-medium">Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

        {/* Erro */}
        {erro && (
          <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text className="text-red-700 text-sm">{erro}</Text>
          </View>
        )}

        {/* Botão Login */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Registrar */}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600 text-sm">Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-blue-600 font-semibold text-sm">Registre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

