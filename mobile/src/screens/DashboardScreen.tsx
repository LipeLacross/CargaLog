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
    const fetchData = async () => {
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

        setRecords(Array.from(recordMap.values()).sort((a, b) => b.carga - a.carga).slice(0, 5));
        setUltimosTreinos(treinos.sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5));
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50">
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
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

      <View className="px-4 py-6 space-y-6">
        {/* Cards */}
        {stats && (
          <View className="space-y-3">
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-600 text-sm">Total Treinos</Text>
              <Text className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTreinos}</Text>
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-600 text-sm">Exercícios Únicos</Text>
              <Text className="text-3xl font-bold text-green-600 mt-2">{stats.exercicios?.length || 0}</Text>
            </View>
          </View>
        )}

        {/* Recordes */}
        {records.length > 0 && (
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-3">🏆 Recordes</Text>
            {records.map((record) => (
              <View key={record.id} className="bg-white rounded-lg p-4 mb-3 flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold text-gray-900">{record.exercicioNome}</Text>
                  <Text className="text-xs text-gray-500">{formatarData(record.data)}</Text>
                </View>
                <Text className="text-2xl font-bold text-blue-600">{formatarCarga(record.carga)}kg</Text>
              </View>
            ))}
          </View>
        )}

        {/* Últimos Treinos */}
        {ultimosTreinos.length > 0 && (
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-3">📅 Últimos Treinos</Text>
            {ultimosTreinos.map((treino, idx) => (
              <View key={treino.id} className="bg-white rounded-lg p-4 mb-2 flex-row items-center">
                <View className="bg-blue-100 w-8 h-8 rounded-full justify-center items-center mr-3">
                  <Text className="text-blue-600 font-bold text-sm">{idx + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{treino.exercicioNome}</Text>
                  <Text className="text-xs text-gray-500">{formatarCarga(treino.carga)}kg × {treino.repeticoes} reps</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Botões */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate('TreinosTab')}
            className="flex-1 bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">Meus Treinos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AnalisesTab')}
            className="flex-1 bg-purple-600 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">Análises</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PerfilTab')}
            className="flex-1 bg-gray-600 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

