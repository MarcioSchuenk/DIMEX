import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useContext } from "react";
import { InputField } from "../components/InputField";
import { AuthButton } from "../components/AuthButton";
import { Card } from "../components/CardFluxoSalaNobre";
import { AuthContext } from "../context/AuthContext";

export const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      navigation.replace("Home");
    } else {
      Alert.alert("Erro", "Usuário ou senha inválidos");
    }
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Card>
              <Text style={styles.header}>Login</Text>

              <InputField
                label="Usuário"
                icon="person"
                value={username}
                onChangeText={setUsername}
                placeholder="Digite seu usuário"
              />

              <InputField
                label="Senha"
                icon="lock"
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? "visibility-off" : "visibility"}
                onRightIconPress={() => setShowPassword((prev) => !prev)}
              />

              <AuthButton onPress={handleLogin} label="ENTRAR" icon="login" />
            </Card>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 20,
  },
  logoImage: {
    width: 170,
    height: 170,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 24,
    textAlign: "center",
  },
});
