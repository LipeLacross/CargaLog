import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { authApi } from '../api/auth.api';

export function ResetSenhaScreen({ navigation, route }: any) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const token = route.params?.token;

  const handleRedefinir = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'Senhas não conferem');
      return;
    }

    if (novaSenha.length < 8) {
      Alert.alert('Erro', 'Mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authApi.confirmarResetSenha({ token, novaSenha });
      Alert.alert('Sucesso', 'Senha redefinida!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao resetar');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-4xl mb-4">❌</Text>
        <Text className="text-2xl font-bold mb-2">Link Inválido</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EsqueciSenha')}
          className="mt-4 bg-blue-600 px-6 py-2 rounded"
        >
          <Text className="text-white font-semibold">Novo Link</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
      <View className="flex-1 justify-center px-6 py-12">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-blue-600">
            🔑 Nova Senha
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Nova Senha
          </Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="Mínimo 8 caracteres"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Confirmar
          </Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          onPress={handleRedefinir}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Redefinir Senha</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
