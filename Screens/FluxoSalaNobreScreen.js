import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://192.168.10.52:3000");

export default function FluxoSalaNobreScreen() {
  const [codigoCaixa, setCodigoCaixa] = useState("");
  const [error, setError] = useState("");
  const API_URL = "http://192.168.10.52:3000/caixas";

  const validateCodigoCaixa = (text) => {
    // Converte para maiúsculas automaticamente
    const upperText = text.toUpperCase();

    // Verifica se começa com CX
    if (upperText && !upperText.startsWith("CX")) {
      setError('O código deve começar com "CX"');
    }
    // Verifica o comprimento
    else if (upperText.length > 8) {
      setError("O código deve ter exatamente 8 caracteres");
    }
    // Verifica caracteres válidos (apenas letras e números)
    else if (!/^[A-Z0-9]*$/.test(upperText)) {
      setError("Apenas letras e números são permitidos");
    } else {
      setError("");
    }

    setCodigoCaixa(upperText);
  };

  const handleSubmit = async () => {
    if (codigoCaixa.trim() === "") {
      Alert.alert("Erro", "Por favor, insira o código da caixa");
      return;
    }

    if (codigoCaixa.length !== 8) {
      Alert.alert("Erro", "O código deve ter exatamente 8 caracteres");
      return;
    }

    if (!codigoCaixa.startsWith("CX")) {
      Alert.alert("Erro", 'O código deve começar com "CX"');
      return;
    }

    if (!/^[A-Z0-9]+$/.test(codigoCaixa)) {
      Alert.alert("Erro", "Apenas letras maiúsculas e números são permitidos");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        codigo: codigoCaixa,
      });

      // Verificação explícita de status
      if (response.status === 201 || response.status === 200) {
        // Envia o socket só após confirmação de sucesso
        socket.emit("novaCaixa", {
          codigo: codigoCaixa,
          created_at: new Date().toISOString(),
        });

        Alert.alert("Sucesso", "Código registrado com sucesso!");
        setCodigoCaixa("");
        setError("");
      } else {
        Alert.alert("Erro", `Falha ao registrar: status ${response.status}`);
      }
    } catch (error) {
      console.log("Erro ao registrar código:", error.message);
      Alert.alert(
        "Erro",
        "Não foi possível registrar o código. Verifique a conexão ou fale com o suporte."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registro de Fluxo - Sala Nobre</Text>

      <View style={styles.card}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Código da Caixa *</Text>
          <View
            style={[styles.inputContainer, error ? styles.inputError : null]}
          >
            <MaterialIcons
              name="qr-code"
              size={20}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={codigoCaixa}
              onChangeText={validateCodigoCaixa}
              placeholder="Bipe o código da caixa. EX:CX123456"
              placeholderTextColor="#9E9E9E"
              autoFocus
              maxLength={8}
              autoCapitalize="characters"
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>ENVIAR</Text>
        <MaterialIcons
          name="send"
          size={20}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#1B5E2040",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#424242",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: "#F44336",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
    includeFontPadding: false,
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
});
