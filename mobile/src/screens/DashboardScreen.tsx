import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { analisesApi } from '../api/analise.api';
import { treinoApi } from '../api/treino.api';
import { formatarCarga, formatarData } from '../utils/formatters';

export function DashboardScreen({ navigation }: any) {
  const { usuario, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [ultimosTreinos, setUltimosTreinos] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    fetchData();
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      setLoading(true);
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

      setRecords(Array.from(recordMap.values()).sort((a, b) => b.carga - a.carga).slice(0, 5));
      setUltimosTreinos(treinos.sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5));
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
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
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-white text-3xl font-bold">Bem-vindo! 💪</Text>
            <Text className="text-blue-100 text-sm mt-1">{usuario?.nome}</Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold text-sm">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 py-6">
        {/* Cards de Estatísticas */}
        {stats && (
          <>
            <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
              <Text className="text-gray-600 text-sm font-medium">Total Treinos</Text>
              <Text className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTreinos}</Text>
            </View>

            <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <Text className="text-gray-600 text-sm font-medium">Exercícios Únicos</Text>
              <Text className="text-3xl font-bold text-green-600 mt-2">{stats.exercicios?.length || 0}</Text>
            </View>
          </>
        )}

        {/* Recordes Pessoais */}
        {records.length > 0 && (
          <>
            <Text className="text-xl font-bold text-gray-900 mb-3">🏆 Top Recordes</Text>
            {records.map((record) => (
              <View key={record.id} className="bg-white rounded-lg p-4 mb-2 flex-row justify-between items-center shadow-sm">
                <View>
                  <Text className="font-semibold text-gray-900">{record.exercicioNome}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{formatarData(record.data)}</Text>
                </View>
                <Text className="text-2xl font-bold text-blue-600">{formatarCarga(record.carga)}kg</Text>
              </View>
            ))}
          </>
        )}

        {/* Últimos Treinos */}
        {ultimosTreinos.length > 0 && (
          <>
            <Text className="text-xl font-bold text-gray-900 mb-3 mt-6">📅 Últimos Treinos</Text>
            {ultimosTreinos.map((treino) => (
              <View key={treino.id} className="bg-white rounded-lg p-4 mb-2 border-l-4 border-purple-600 shadow-sm">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{treino.exercicioNome}</Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      {formatarCarga(treino.carga)}kg × {treino.repeticoes} reps
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">{formatarData(treino.data)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

