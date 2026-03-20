import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { View, Text } from 'react-native';

// Telas de Auth
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { EsqueciSenhaScreen } from '../screens/EsqueciSenhaScreen';
import { ResetSenhaScreen } from '../screens/ResetSenhaScreen';

// Telas Principais
import { DashboardScreen } from '../screens/DashboardScreen';
import { TreinosScreen } from '../screens/TreinosScreen';
import { NovoTreinoScreen } from '../screens/NovoTreinoScreen';
import { EditarTreinoScreen } from '../screens/EditarTreinoScreen';
import { AnalisesScreen } from '../screens/AnalisesScreen';
import { PerfilScreen } from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon Component - Simples, sem SVG
const TabIcon = ({ name, label }: { name: string; label: string }) => (
  <View className="items-center">
    <Text className="text-lg">{name}</Text>
    <Text className="text-xs mt-1">{label}</Text>
  </View>
);

// Stack de Auth
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="EsqueciSenha" component={EsqueciSenhaScreen} />
      <Stack.Screen name="ResetSenha" component={ResetSenhaScreen} />
    </Stack.Navigator>
  );
}

// Stack de Treinos (dentro das tabs)
function TreinosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TreinosList" component={TreinosScreen} />
      <Stack.Screen name="NovoTreino" component={NovoTreinoScreen} />
      <Stack.Screen name="EditarTreino" component={EditarTreinoScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator para telas principais
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#6b7280',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarIcon: () => <TabIcon name="🏠" label="Home" />,
        }}
      />
      <Tab.Screen
        name="TreinosTab"
        component={TreinosStack}
        options={{
          tabBarIcon: () => <TabIcon name="💪" label="Treinos" />,
        }}
      />
      <Tab.Screen
        name="AnalisesTab"
        component={AnalisesScreen}
        options={{
          tabBarIcon: () => <TabIcon name="📊" label="Análises" />,
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{
          tabBarIcon: () => <TabIcon name="👤" label="Perfil" />,
        }}
      />
    </Tab.Navigator>
  );
}

// Navegador Principal
export function RootNavigator() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
