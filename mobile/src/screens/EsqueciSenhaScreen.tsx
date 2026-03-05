import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { authApi } from '../api/auth.api';

export function EsqueciSenhaScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite seu email');
      return;
    }

    setLoading(true);

    try {
      await authApi.esqueciSenha({ email });
      setEnviado(true);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50 px-6">
        <View className="bg-white rounded-xl p-6 items-center">
          <Text className="text-4xl mb-4">✅</Text>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Email Enviado!</Text>
          <Text className="text-gray-600 text-center mb-6">
            Verifique seu email para o link de redefinição de senha.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="w-full bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
      <View className="flex-1 justify-center px-6 py-12">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-blue-600">🔐 Recuperar Acesso</Text>
          <Text className="text-gray-600 text-sm mt-2">Digite seu email para receber um link de redefinição</Text>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          onPress={handleEnviar}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Enviar Link de Reset</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="mt-6"
        >
          <Text className="text-blue-600 font-semibold text-center">← Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

