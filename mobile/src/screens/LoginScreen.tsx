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
      // Navegação automática pelo contexto de autenticação
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="flex-1 justify-center min-h-screen px-6 py-12">
        {/* Título */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-blue-600">CargaLog</Text>
          <Text className="text-base text-gray-700 mt-2">Rastreie sua progressão de carga</Text>
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
          <TextInput
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900"
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Senha Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Senha</Text>
          <TextInput
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900"
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!loading}
          />
          <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')} className="mt-2">
            <Text className="text-xs font-medium text-blue-600">Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

        {/* Erro Message */}
        {erro && (
          <View className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <Text className="text-sm text-red-700">{erro}</Text>
          </View>
        )}

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 py-3 rounded-lg mt-6"
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-base font-semibold text-white text-center">Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-sm text-gray-700">Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-sm font-semibold text-blue-600">Registre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

