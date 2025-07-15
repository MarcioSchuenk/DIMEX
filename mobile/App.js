// App.js
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";

// Telas
import { HomeScreen } from "./src/Screens/HomeScreen";
import SobrasCarregamentoScreen from "./src/Screens/SobrasCarregamentoScreen";
import SobrasSalaNobreScreen from "./src/Screens/SobrasSalaNobreScreen";
import { FormularioPedidosScreen } from "./src/Screens/FormularioPedidosScreen";
import { FluxoSalaNobreScreen } from "./src/Screens/FluxoSalaNobreScreen";
import { LoginScreen } from "./src/Screens/LoginScreen";
import { FormularioApp } from "./src/Screens/RegistroAtendimentoScreen";
import { FinalizaçãoCarrinhos } from "./src/Screens/FinalizaçãoCarrinhos";

const Stack = createStackNavigator();

function AppRoutes() {
  const { auth } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {auth ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="SobrasCarregamento"
              component={SobrasCarregamentoScreen}
              options={{ headerShown: true, title: "Sobras do Carregamento" }}
            />
            <Stack.Screen
              name="SobrasSalaNobre"
              component={SobrasSalaNobreScreen}
              options={{ headerShown: true, title: "Sobras da Sala Nobre" }}
            />
            <Stack.Screen
              name="FluxoSalaNobre"
              component={FluxoSalaNobreScreen}
              options={{ headerShown: true, title: "Fluxo Sala Nobre" }}
            />
            <Stack.Screen
              name="SeparacaoCarrinhos"
              component={FormularioPedidosScreen}
              options={{ headerShown: true, title: "Separação de Carrinhos" }}
            />
            <Stack.Screen
              name="FinalizacaoCarrinhos"
              component={FinalizaçãoCarrinhos}
              options={{ headerShown: true, title: "Finalização de carrinhos" }}
            />
            <Stack.Screen
              name="RegistroAtendimento"
              component={FormularioApp}
              options={{ headerShown: true, title: "Registro de Atendimento" }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
