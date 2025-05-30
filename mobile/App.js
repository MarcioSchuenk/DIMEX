import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/Screens/HomeScreen";
import SobrasCarregamentoScreen from "./src/Screens/SobrasCarregamentoScreen";
import SobrasSalaNobreScreen from "./src/Screens/SobrasSalaNobreScreen";
import { FormularioPedidosScreen } from "./src/Screens/FormularioPedidosScreen";
import { FluxoSalaNobreScreen } from "./src/Screens/FluxoSalaNobreScreen";
import { LoginScreen } from "./src/Screens/LoginScreen";
import { FormularioApp } from "./src/Screens/RegistroAtendimentoScreen";
import { AuthProvider } from "./providers/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
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
              component={FormularioPedidosScreen}
              options={{ title: "Separação de Carrinhos", headerShown: true }}
            />
            <Stack.Screen
              name="RegistroAtendimento"
              component={FormularioApp}
              options={{ title: "Registro de Atendimento", headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}