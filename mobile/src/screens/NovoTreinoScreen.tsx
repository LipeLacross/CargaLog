import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { treinoApi } from '../api/treino.api';

export function NovoTreinoScreen({ navigation }: any) {
  const [exercicio, setExercicio] = useState('');
  const [carga, setCarga] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleCriar = async () => {
    if (!exercicio || !carga || !repeticoes) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      await treinoApi.criar({
        exercicioNome: exercicio,
        carga: parseFloat(carga),
        repeticoes: parseInt(repeticoes, 10),
        data,
      });

      Alert.alert('Sucesso', 'Treino criado!', [
        { text: 'OK', onPress: () => navigation.navigate('Treinos') }
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao criar treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-8">➕ Novo Treino</Text>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Exercício</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="Ex: Supino Reto"
            value={exercicio}
            onChangeText={setExercicio}
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Carga (kg)</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="54"
            value={carga}
            onChangeText={setCarga}
            keyboardType="decimal-pad"
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Repetições</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="8"
            value={repeticoes}
            onChangeText={setRepeticoes}
            keyboardType="number-pad"
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Data</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            placeholder="YYYY-MM-DD"
            value={data}
            onChangeText={setData}
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={loading}
            className="flex-1 border border-gray-300 py-3 rounded-lg"
          >
            <Text className="text-gray-700 font-semibold text-center">Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCriar}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-lg flex-row justify-center items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Criar Treino</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}


