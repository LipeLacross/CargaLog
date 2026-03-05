import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { analisesApi } from '../api/analise.api';
import { treinoApi } from '../api/treino.api';
import { formatarCarga, formatarData } from '../utils/formatters';

export function AnalisesScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    carregarAnalises();
  }, []);

  const carregarAnalises = async () => {
    try {
      const statsRes = await analisesApi.estatisticas();
      setStats(statsRes.data);

      const treinosRes = await treinoApi.listar();
      const treinos = treinosRes.data;

      const recordMap = new Map();
      treinos.forEach((t: any) => {
        const key = t.exercicioNome.toLowerCase();
        const carga = Number(t.carga);
        if (!recordMap.get(key) || carga > recordMap.get(key).carga) {
          recordMap.set(key, { ...t, carga });
        }
      });

      setRecords(Array.from(recordMap.values()).sort((a, b) => b.carga - a.carga));
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
      <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
        <Text className="text-white text-2xl font-bold">📊 Análises</Text>
      </View>

      <View className="px-4 py-6">
        {stats && (
          <>
            <View className="bg-white rounded-lg p-4 mb-3">
              <Text className="text-gray-600 text-sm">Total Treinos</Text>
              <Text className="text-4xl font-bold text-blue-600 mt-2">{stats.totalTreinos}</Text>
            </View>

            <View className="bg-white rounded-lg p-4 mb-3">
              <Text className="text-gray-600 text-sm">Exercícios</Text>
              <Text className="text-4xl font-bold text-green-600 mt-2">{stats.exercicios?.length || 0}</Text>
            </View>

            {stats.exercicioMaisTreinado && (
              <View className="bg-white rounded-lg p-4 mb-6">
                <Text className="text-gray-600 text-sm">Mais Treinado</Text>
                <Text className="text-2xl font-bold text-purple-600 mt-2">{stats.exercicioMaisTreinado.nome}</Text>
                <Text className="text-sm text-gray-500 mt-1">{stats.exercicioMaisTreinado.quantidade}x</Text>
              </View>
            )}
          </>
        )}

        <Text className="text-xl font-bold text-gray-900 mb-3">🏆 Recordes</Text>
        {records.map((record) => (
          <View key={record.id} className="bg-white rounded-lg p-4 mb-2">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-semibold text-gray-900">{record.exercicioNome}</Text>
                <Text className="text-xs text-gray-500 mt-1">{formatarData(record.data)}</Text>
              </View>
              <Text className="text-2xl font-bold text-blue-600">{formatarCarga(record.carga)}kg</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


