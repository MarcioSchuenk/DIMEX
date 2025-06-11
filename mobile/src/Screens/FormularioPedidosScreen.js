import React, { useState } from "react";
import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import { Card } from "../components/CardFluxoSalaNobre";
import { InputField } from "../components/InputField";
import { AddItemButton } from "../components/AddItemButton";
import { AuthButton } from "../components/AuthButton";


export const FormularioPedidosScreen = () => {
  const [codigoSeparador, setCodigoSeparador] = useState("");
  const [codigoSeparadorError, setCodigoSeparadorError] = useState(false);
  const [pedidos, setPedidos] = useState([
    { id: 1, valor: "", hasError: false },
  ]);

  // Validações
  const validateNumber = (value) => /^\d*$/.test(value);
  const validatePedidoLength = (value) =>
    value.length === 0 || value.length === 7;
  const validateCodigoSeparadorLength = (value) => value.length === 6;

  // Handlers
  const handleCodigoSeparadorChange = (value) => {
    if (value !== "" && !validateNumber(value)) return;
    setCodigoSeparador(value);
    if (codigoSeparadorError && validateCodigoSeparadorLength(value)) {
      setCodigoSeparadorError(false);
    }
  };

  const handlePedidoChange = (id, value) => {
    if (value !== "" && !validateNumber(value)) return;

    setPedidos((prev) =>
      prev.map((pedido) => {
        if (pedido.id === id) {
          const hasError = value !== "" && !validatePedidoLength(value);
          return { ...pedido, valor: value, hasError };
        }
        return pedido;
      })
    );
  };

  const adicionarPedido = () => {
    if (pedidos.length >= 5) return;
    const maxId = Math.max(...pedidos.map((p) => p.id), 0);
    setPedidos([...pedidos, { id: maxId + 1, valor: "", hasError: false }]);
  };

  const removerPedido = (id) => {
    if (pedidos.length <= 1) return;
    setPedidos(pedidos.filter((pedido) => pedido.id !== id));
  };

  const validateForm = () => {
    let isValid = true;

    // Validar código do separador
    const codigoInvalido =
      !codigoSeparador || !validateCodigoSeparadorLength(codigoSeparador);
    setCodigoSeparadorError(codigoInvalido);
    if (codigoInvalido) isValid = false;

    // Validar pedidos
    const updatedPedidos = pedidos.map((pedido, index) => {
      const isRequired = index === 0;
      const isEmpty = pedido.valor.length === 0;
      const hasError =
        (isRequired && isEmpty) ||
        (pedido.valor && !validatePedidoLength(pedido.valor));

      if (hasError) isValid = false;

      return { ...pedido, hasError };
    });

    setPedidos(updatedPedidos);
    return isValid;
  };

  const resetForm = () => {
    setCodigoSeparador("");
    setCodigoSeparadorError(false);
    setPedidos([{ id: 1, valor: "", hasError: false }]);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      const errors = [];

      if (!codigoSeparador) {
        errors.push("• Código do Separador é obrigatório");
      } else if (!validateCodigoSeparadorLength(codigoSeparador)) {
        errors.push("• Código do Separador deve ter exatamente 6 dígitos");
      }

      pedidos.forEach((pedido, index) => {
        const pedidoNum = index + 1;
        if (index === 0 && pedido.valor.length === 0) {
          errors.push(`• Pedido 01 é obrigatório`);
        }
        if (pedido.valor && !validatePedidoLength(pedido.valor)) {
          errors.push(
            `• Pedido ${String(pedidoNum).padStart(
              2,
              "0"
            )} deve ter exatamente 7 dígitos`
          );
        }
      });

      Alert.alert("Erros no formulário", errors.join("\n"));
      return;
    }

    const formData = {
      codigoSeparador,
      pedidos: pedidos.map((p) => p.valor).filter((v) => v !== ""),
    };

    console.log("Dados enviados:", formData);
    Alert.alert("Sucesso", "Pedidos enviados com sucesso!", [
      { text: "OK", onPress: resetForm },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registro de separação</Text>

      <Card>
        {/* Código do Separador */}
        <InputField
          label="Código do Separador *"
          icon="person-pin"
          value={codigoSeparador}
          onChangeText={handleCodigoSeparadorChange}
          placeholder="Digite o código do separador (6 dígitos)"
          keyboardType="numeric"
          maxLength={6}
          error={codigoSeparadorError}
          errorMessage={
            codigoSeparador.length === 0
              ? "Este campo é obrigatório"
              : "O código deve ter exatamente 6 dígitos"
          }
        />

        {/* Lista de Pedidos */}
        {pedidos.map((pedido, index) => (
          <View key={pedido.id} style={styles.pedidoContainer}>
            <InputField
              label={`Pedido ${String(index + 1).padStart(2, "0")}${
                index === 0 ? " *" : ""
              }`}
              icon="shopping-cart"
              value={pedido.valor}
              onChangeText={(text) => handlePedidoChange(pedido.id, text)}
              placeholder="Bipe o número do pedido (7 dígitos)"
              keyboardType="numeric"
              maxLength={7}
              error={pedido.hasError}
              errorMessage={
                index === 0 && pedido.valor.length === 0
                  ? "Este campo é obrigatório"
                  : "O pedido deve ter exatamente 7 dígitos"
              }
              rightIcon={index > 0 ? "close" : undefined}
              onRightIconPress={
                index > 0 ? () => removerPedido(pedido.id) : undefined
              }
            />
          </View>
        ))}

        {/* Botão para adicionar novo pedido */}
        <AddItemButton
          onPress={adicionarPedido}
          label="Adicionar Pedido"
          disabled={pedidos.length >= 5}
        />
      </Card>

      {/* Botão de Envio */}
      <AuthButton onPress={handleSubmit} label="ENVIAR" icon="send" />
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
    fontSize: 24,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 24,
    textAlign: "center",
  },
  pedidoContainer: {
    marginBottom: 16,
  },
});
