import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { analisesApi } from '../api/analise.api';
import { treinoApi } from '../api/treino.api';
import { formatarCarga, formatarData } from '../utils/formatters';

export function AnalisesScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarAnalises();
  }, []);

  const carregarAnalises = async () => {
    try {
      setError(null);
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

      setRecords(
        Array.from(recordMap.values()).sort((a, b) => b.carga - a.carga),
      );
    } catch (err: any) {
      console.error('Erro ao carregar análises:', err);
      setError('Erro ao carregar análises');
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
    <ScrollView className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 py-6">
        <Text className="text-white text-2xl font-bold">📊 Análises</Text>
      </View>

      {/* Conteúdo */}
      <View className="px-4 py-6">
        {error && (
          <View className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        )}

        {stats && (
          <>
            {/* Card Total Treinos */}
            <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
              <Text className="text-gray-600 text-sm font-medium">
                Total Treinos
              </Text>
              <Text className="text-4xl font-bold text-blue-600 mt-2">
                {stats.totalTreinos}
              </Text>
            </View>

            {/* Card Exercícios */}
            <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
              <Text className="text-gray-600 text-sm font-medium">
                Exercícios Únicos
              </Text>
              <Text className="text-4xl font-bold text-green-600 mt-2">
                {stats.exercicios?.length || 0}
              </Text>
            </View>

            {/* Card Mais Treinado */}
            {stats.exercicioMaisTreinado && (
              <View className="bg-white rounded-lg p-4 mb-6 shadow-sm border-l-4 border-purple-600">
                <Text className="text-gray-600 text-sm font-medium">
                  Exercício Mais Treinado
                </Text>
                <Text className="text-2xl font-bold text-purple-600 mt-2">
                  {stats.exercicioMaisTreinado.nome}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {stats.exercicioMaisTreinado.quantidade}x
                </Text>
              </View>
            )}
          </>
        )}

        {/* Recordes */}
        <Text className="text-xl font-bold text-gray-900 mb-3">
          🏆 Recordes Pessoais
        </Text>
        {records.length === 0 ? (
          <View className="bg-white rounded-lg p-4">
            <Text className="text-gray-500 text-center">
              Nenhum recorde registrado ainda
            </Text>
          </View>
        ) : (
          records.map(record => (
            <View
              key={record.id}
              className="bg-white rounded-lg p-4 mb-2 shadow-sm"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {record.exercicioNome}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {formatarData(record.data)}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-blue-600">
                  {formatarCarga(record.carga)}kg
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
