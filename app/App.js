import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from "../Screens/HomeScreen";
import SobrasCarregamentoScreen from "../Screens/SobrasCarregamentoScreen";
import SobrasSalaNobreScreen from "../Screens/SobrasSalaNobreScreen";
import FluxoSalaNobreScreen from "../Screens/FluxoSalaNobreScreen";
import SeparacaoCarrinhos from "../Screens/SeparacaoCarrinhosScreen";
import LoginScreen from "../Screens/LoginScreen";
import RegistroAtendimento from "../Screens/RegistroAtendimentoScreen";
import { AuthProvider } from "../providers/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen 
              name="SobrasCarregamento" 
              component={SobrasCarregamentoScreen} 
              options={{ title: "Sobras do Carregamento", headerShown: true }} 
            />
            <Stack.Screen 
              name="SobrasSalaNobre" 
              component={SobrasSalaNobreScreen} 
              options={{ title: "Sobras da Sala Nobre", headerShown: true }} 
            />
            <Stack.Screen 
              name="FluxoSalaNobre" 
              component={FluxoSalaNobreScreen} 
              options={{ title: "Fluxo Sala Nobre", headerShown: true }} 
            />
            <Stack.Screen 
              name="SeparacaoCarrinhos" 
              component={SeparacaoCarrinhos} 
              options={{ title: "Separação em ruas", headerShown: true }} 
            />
            <Stack.Screen 
              name="RegistroAtendimento" 
              component={RegistroAtendimento} 
              options={{ title: "Registro de Atendimento", headerShown: true }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}