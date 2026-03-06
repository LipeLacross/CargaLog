import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert, ScrollView } from 'react-native';
import { treinoApi } from '../api/treino.api';
import { formatarCarga, formatarData } from '../utils/formatters';

export function TreinosScreen({ navigation }: any) {
  const [treinos, setTreinos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarTreinos();
    });

    carregarTreinos();

    return unsubscribe;
  }, [navigation]);

  const carregarTreinos = async () => {
    try {
      setLoading(true);
      const res = await treinoApi.listar();
      setTreinos(res.data);
    } catch (err) {
      console.error('Erro ao carregar treinos:', err);
      Alert.alert('Erro', 'Falha ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, nome: string) => {
    Alert.alert(
      'Deletar Treino?',
      `Tem certeza que deseja deletar "${nome}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await treinoApi.deletar(id);
              setTreinos(treinos.filter(t => t.id !== id));
              Alert.alert('Sucesso', 'Treino deletado');
            } catch (err) {
              console.error('Erro ao deletar:', err);
              Alert.alert('Erro', 'Erro ao deletar treino');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 py-6">
        <Text className="text-white text-2xl font-bold">💪 Meus Treinos</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('NovoTreino')}
          className="bg-green-500 mt-4 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">+ Novo Treino</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Treinos */}
      {treinos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">Nenhum treino registrado</Text>
          <Text className="text-gray-400 text-sm mt-2">Comece adicionando seu primeiro treino</Text>
        </View>
      ) : (
        <FlatList
          data={treinos}
          renderItem={({ item }) => (
            <View className="mx-4 mt-4 bg-white rounded-lg p-4 border-l-4 border-blue-600">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">{item.exercicioNome}</Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {formatarCarga(item.carga)}kg × {item.repeticoes} reps
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {formatarData(item.data)}
                  </Text>
                </View>
              </View>

              {/* Botões de ação */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditarTreino', { id: item.id })}
                  className="flex-1 bg-blue-600 py-2 rounded"
                >
                  <Text className="text-white font-semibold text-center text-sm">✏️ Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.exercicioNome)}
                  className="flex-1 bg-red-600 py-2 rounded"
                >
                  <Text className="text-white font-semibold text-center text-sm">🗑️ Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}





