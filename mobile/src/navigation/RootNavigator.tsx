import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';

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

// Tab Navigator para telas principais
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: route.name === 'DashboardTab' ? '🏠 Dashboard' :
                     route.name === 'TreinosTab' ? '💪 Treinos' :
                     route.name === 'AnalisesTab' ? '📊 Análises' : '👤 Perfil',
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#6b7280',
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="TreinosTab"
        component={TreinosStack}
        options={{ title: 'Treinos' }}
      />
      <Tab.Screen
        name="AnalisesTab"
        component={AnalisesScreen}
        options={{ title: 'Análises' }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Stack de Treinos (dentro das tabs)
function TreinosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Treinos" component={TreinosScreen} />
      <Stack.Screen name="NovoTreino" component={NovoTreinoScreen} />
      <Stack.Screen name="EditarTreino" component={EditarTreinoScreen} />
    </Stack.Navigator>
  );
}

// Navegador Principal
export function RootNavigator() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {usuario ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

