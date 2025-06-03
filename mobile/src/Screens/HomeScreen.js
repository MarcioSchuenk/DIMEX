// screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, StatusBar, Linking } from "react-native";
import { useAuth } from "../../providers/AuthContext";
import { CardButton } from "../components/CardButton";
import { FloatingActionButton } from "../components/FloatingActionButton";

export const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleOpenAnalytics = () => {
    Linking.openURL("https://dimex-nu.vercel.app");
  };

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Controle de Operações Logísticas</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Cards administrativos - apenas para ADMIN */}
        {user?.role === "ADMIN" && (
          <>
            <CardButton
              icon="local-shipping"
              title="Sobras de Carregamento"
              subtitle="Registrar no app"
              onPress={() => navigation.navigate("SobrasCarregamento")}
            />

            <CardButton
              icon="meeting-room"
              title="Sobras da Sala Nobre"
              subtitle="Registrar no app"
              onPress={() => navigation.navigate("SobrasSalaNobre")}
            />

            <CardButton
              icon="shopping-cart"
              title="Retirada de Carrinhos"
              subtitle="Registrar retirada de carrinhos"
              onPress={() => navigation.navigate("SeparacaoCarrinhos")}
            />

            <CardButton
              icon="assignment"
              title="Registro de Atendimento"
              subtitle="Registrar produtos atendidos"
              onPress={() => navigation.navigate("RegistroAtendimento")}
            />
          </>
        )}

        {/* Card para NOBRE e USER */}
        {(user?.role === "NOBRE" || user?.role === "ADMIN") && (
          <CardButton
            icon="swap-vert"
            title="Fluxo da sala nobre"
            subtitle="Registrar código da caixa"
            onPress={() => navigation.navigate("FluxoSalaNobre")}
          />
        )}
      </View>

      {user?.role === "ADMIN" && (
        <FloatingActionButton
          icon="analytics"
          label="WEB PAGE ANALYTICS"
          onPress={handleOpenAnalytics}
          position="left"
        />
      )}

      <FloatingActionButton
        icon="logout"
        label="SAIR"
        onPress={handleLogout}
        position="right"
        color="#E53935"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 58,
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
  },
  cardsContainer: {
    width: "100%",
    flex: 1,
    marginBottom: 70,
  },
});
