// screens/FluxoSalaNobreScreen.tsx
import React, { useState } from "react";
import { View, Text, Alert, ScrollView, StyleSheet } from "react-native";
import { CodigoCaixaInput } from "../components/CodigoCaixaInput";
import { registrarCodigoCaixa } from "../services/caixaService";
import { validateCaixaCode } from "../utils/validation.caixa";
import { SubmitButton } from "../components/SubmitButton";
import { Card } from "../components/CardFluxoSalaNobre";

export const FluxoSalaNobreScreen: React.FC = () => {
  const [codigoCaixa, setCodigoCaixa] = useState("");
  const [error, setError] = useState("");

  const handleCodeChange = (text: string) => {
    const upperText = text.toUpperCase();
    setCodigoCaixa(upperText);
    setError(validateCaixaCode(upperText));
  };

  const handleSubmit = async () => {
    if (error || codigoCaixa.length !== 8) {
      Alert.alert("Erro", "Verifique o código antes de enviar.");
      return;
    }

    try {
      await registrarCodigoCaixa(codigoCaixa);
      Alert.alert("Sucesso", "Código registrado com sucesso!");
      setCodigoCaixa("");
    } catch (err: any) {
      console.error("Erro ao registrar:", err.message);
      Alert.alert("Erro", "Falha ao registrar código. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registro de Fluxo - Sala Nobre</Text>

      <Card>
        <CodigoCaixaInput
          value={codigoCaixa}
          error={error}
          onChange={handleCodeChange}
        />
      </Card>

      <SubmitButton onPress={handleSubmit} label="ENVIAR" />
    </ScrollView>
  );
};

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
});
