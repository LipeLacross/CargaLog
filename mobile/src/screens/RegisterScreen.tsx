import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { registrar } = useAuth();

  const handleRegistro = async () => {
    if (!nome || !email || !senha) {
      setErro('Todos os campos são obrigatórios');
      return;
    }

    if (senha.length < 8) {
      setErro('Senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await registrar(nome, email, senha);
      // Navegação automática pelo contexto de autenticação
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="flex-1 px-6 py-12">
        {/* Título */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-blue-600">CargaLog</Text>
          <Text className="text-base text-gray-700 mt-2">Crie sua conta</Text>
        </View>

        {/* Nome Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Nome</Text>
          <TextInput
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900"
            placeholder="Seu nome completo"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
            editable={!loading}
            autoCapitalize="words"
          />
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Email
          </Text>
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
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Senha
          </Text>
          <TextInput
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900"
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!loading}
          />
          <Text className="text-xs text-gray-500 mt-1">
            Deve conter letras e números
          </Text>
        </View>

        {/* Erro Message */}
        {erro && (
          <View className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <Text className="text-sm text-red-700">{erro}</Text>
          </View>
        )}

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegistro}
          disabled={loading}
          className="w-full bg-blue-600 py-3 rounded-lg mt-6"
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-base font-semibold text-white text-center">
              Registrar
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-sm text-gray-700">Já tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-sm font-semibold text-blue-600">
              Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
