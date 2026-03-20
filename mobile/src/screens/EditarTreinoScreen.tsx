import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { treinoApi } from '../api/treino.api';

export function EditarTreinoScreen({ navigation, route }: any) {
  const { id } = route.params;
  const [exercicio, setExercicio] = useState('');
  const [carga, setCarga] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarTreino();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarTreino = async () => {
    try {
      const res = await treinoApi.listar();
      const treino = res.data.find((t: any) => t.id === id);
      if (treino) {
        setExercicio(treino.exercicioNome);
        setCarga(treino.carga.toString());
        setRepeticoes(treino.repeticoes.toString());
        setData(treino.data);
      }
    } catch {
      Alert.alert('Erro', 'Erro ao carregar treino');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!exercicio || !carga || !repeticoes) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setSalvando(true);

    try {
      await treinoApi.atualizar(id, {
        exercicioNome: exercicio,
        carga: parseFloat(carga),
        repeticoes: parseInt(repeticoes, 10),
        data,
      });

      Alert.alert('Sucesso', 'Treino atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao atualizar');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-8">
          ✏️ Editar Treino
        </Text>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Exercício
          </Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            value={exercicio}
            onChangeText={setExercicio}
            editable={!salvando}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Carga (kg)
          </Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            value={carga}
            onChangeText={setCarga}
            keyboardType="decimal-pad"
            editable={!salvando}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Repetições
          </Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            value={repeticoes}
            onChangeText={setRepeticoes}
            keyboardType="number-pad"
            editable={!salvando}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Data</Text>
          <TextInput
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
            value={data}
            onChangeText={setData}
            editable={!salvando}
            placeholderTextColor="#999"
          />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={salvando}
            className="flex-1 border border-gray-300 py-3 rounded-lg"
          >
            <Text className="text-gray-700 font-semibold text-center">
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSalvar}
            disabled={salvando}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg flex-row justify-center items-center"
          >
            {salvando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
