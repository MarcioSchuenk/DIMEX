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

const RegistroAtendimento = () => {
  // Estados do formulário
  const [nomeCliente, setNomeCliente] = useState("");
  const [motorista, setMotorista] = useState("");
  const [ajudante, setAjudante] = useState("");
  const [produtos, setProdutos] = useState([
    {
      codigo: "",
      numero: "",
      quantidade: "",
      descricao: "",
      observacao: "",
    },
  ]);
  const [enviando, setEnviando] = useState(false);

  // Configurações do Pipefy - SUBSTITUA COM SEUS DADOS REAIS
  const PIPE_ID = "306350886"; // Encontre no URL do seu pipe (ex: "123456")
  const PIPE_TOKEN =
    "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaXBlZnkiLCJpYXQiOjE3NDc4NjQ0NDEsImp0aSI6IjNiZTU3MGFiLTY3MjMtNDI0MS04OWIwLWJiYmNiNjIyNTBiMCIsInN1YiI6MzA1NjQ5NTY0LCJ1c2VyIjp7ImlkIjozMDU2NDk1NjQsImVtYWlsIjoicGVkcm8uZUBncnVwb2RpbWUuY29tLmJyIn19.61GdOq6PRR_Hi88sxNfZdJ7HUdSlxct-H-q6fGMLkcZ8gZFlNcPBPzsWO45S6QZz7BryZAlpWhROzuiSbmgOmw"; // Seu token de API completo
  const FIELD_IDS = {
    cliente: "nome_do_cliente",
    motorista: "motorista",
    ajudante: "ajudante",
    codigo: "codigo",
    numero: "numero",
    quantidade: "quatidade",
    descricao: "descri_o",
    observacao: "observa_o",
  };

  // Funções auxiliares

  const atualizarProduto = (index, campo, valor) => {
    const novosProdutos = [...produtos];
    novosProdutos[index][campo] = valor;
    setProdutos(novosProdutos);
  };

  const limparFormulario = () => {
    setNomeCliente("");
    setMotorista("");
    setAjudante("");
    setProdutos([
      {
        codigo: "",
        numero: "",
        quantidade: "",
        descricao: "",
        observacao: "",
      },
    ]);
  };

  // Função principal para enviar ao Pipefy
  const enviarParaPipefy = async () => {
    // Validação básica
    if (!nomeCliente.trim() || !motorista.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios");
      return;
    }

    const produto = produtos[0]; // Apenas o primeiro produto

    if (!produto.codigo.trim() || !produto.quantidade.trim()) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios do produto");
      return;
    }

    setEnviando(true);

    try {
      const mutation = `
      mutation {
        createCard(input: {
          pipe_id: "${PIPE_ID}",
          fields_attributes: [
            { field_id: "${
              FIELD_IDS.cliente
            }", field_value: "${nomeCliente.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.motorista
            }", field_value: "${motorista.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.ajudante
            }", field_value: "${ajudante.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.codigo
            }", field_value: "${produto.codigo.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.numero
            }", field_value: "${produto.numero.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.quantidade
            }", field_value: "${produto.quantidade.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.descricao
            }", field_value: "${produto.descricao.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.observacao
            }", field_value: "${produto.observacao.replace(/"/g, '\\"')}" }
          ]
        }) { 
          card { 
            id 
            title 
          } 
        }
      }
    `;

      const response = await fetch("https://api.pipefy.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PIPE_TOKEN}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ query: mutation }),
      });

      const data = await response.json();

      if (!response.ok || data.errors) {
        const errorMsg = data?.errors?.[0]?.message || "Erro desconhecido";
        throw new Error(`Pipefy API: ${errorMsg}`);
      }

      if (!data.data?.createCard?.card) {
        throw new Error("Resposta inválida da API");
      }

      Alert.alert(
        "✅ Sucesso",
        `Card criado no Pipefy com ID: ${data.data.createCard.card.id}`
      );
      limparFormulario();
    } catch (error) {
      console.error("Erro completo:", error);
      Alert.alert("❌ Erro", `Falha no envio: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.titulo}>Registro de Atendimento</Text>

      {/* Seção de informações básicas */}
      <View style={styles.secao}>
        <Text style={styles.label}>Nome do Cliente *</Text>
        <TextInput
          style={styles.input}
          value={nomeCliente}
          onChangeText={setNomeCliente}
          placeholder="Nome completo do cliente"
          editable={!enviando}
        />

        <Text style={styles.label}>Motorista *</Text>
        <TextInput
          style={styles.input}
          value={motorista}
          onChangeText={setMotorista}
          placeholder="Nome do motorista"
          editable={!enviando}
        />

        <Text style={styles.label}>Ajudante</Text>
        <TextInput
          style={styles.input}
          value={ajudante}
          onChangeText={setAjudante}
          placeholder="Nome do ajudante (opcional)"
          editable={!enviando}
        />
      </View>

      {/* Seção de produtos */}
      <Text style={[styles.label, styles.secaoTitulo]}>Produtos</Text>

      {produtos.map((produto, index) => (
        <View key={index} style={styles.produtoContainer}>
          <Text style={styles.subtitulo}>Produto {index + 1}</Text>

          <Text style={styles.label}>Código *</Text>
          <TextInput
            style={styles.input}
            value={produto.codigo}
            onChangeText={(text) => atualizarProduto(index, "codigo", text)}
            placeholder="Código do produto"
            keyboardType="default"
            editable={!enviando}
          />

          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            value={produto.numero}
            onChangeText={(text) => atualizarProduto(index, "numero", text)}
            placeholder="Número (opcional)"
            keyboardType="numeric"
            editable={!enviando}
          />

          <Text style={styles.label}>Quantidade *</Text>
          <TextInput
            style={styles.input}
            value={produto.quantidade}
            onChangeText={(text) => atualizarProduto(index, "quantidade", text)}
            placeholder="Quantidade"
            keyboardType="numeric"
            editable={!enviando}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={produto.descricao}
            onChangeText={(text) => atualizarProduto(index, "descricao", text)}
            placeholder="Descrição do produto"
            multiline
            editable={!enviando}
          />

          <Text style={styles.label}>Observação</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={produto.observacao}
            onChangeText={(text) => atualizarProduto(index, "observacao", text)}
            placeholder="Observações adicionais"
            multiline
            editable={!enviando}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.botaoPrimario, enviando && styles.botaoDesabilitado]}
        onPress={enviarParaPipefy}
        disabled={enviando}
      >
        <Text style={styles.botaoTexto}>
          {enviando ? "Enviando..." : "Enviar para Pipefy"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Estilos melhorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  secao: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#34495e",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  produtoContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2c3e50",
  },
  botaoPrimario: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    elevation: 2,
  },
  botaoSecundario: {
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  botaoRemover: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegistroAtendimento;
