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
import Icon from "react-native-vector-icons/Feather";

const RegistroAtendimento = () => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [origemNF, setOrigemNF] = useState("");
  const [motorista, setMotorista] = useState("");
  const [ajudante, setAjudante] = useState("");
  const [produtos, setProdutos] = useState([
    { codigo: "", quantidade: "", descricao: "", observacao: "" }, // Adicionei código aqui
  ]);
  const [enviando, setEnviando] = useState(false);

  const PIPE_ID = "306350886";
  const PIPE_TOKEN =
    "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaXBlZnkiLCJpYXQiOjE3NDc4NjQ0NDEsImp0aSI6IjNiZTU3MGFiLTY3MjMtNDI0MS04OWIwLWJiYmNiNjIyNTBiMCIsInN1YiI6MzA1NjQ5NTY0LCJ1c2VyIjp7ImlkIjozMDU2NDk1NjQsImVtYWlsIjoicGVkcm8uZUBncnVwb2RpbWUuY29tLmJyIn19.61GdOq6PRR_Hi88sxNfZdJ7HUdSlxct-H-q6fGMLkcZ8gZFlNcPBPzsWO45S6QZz7BryZAlpWhROzuiSbmgOmw";
  const FIELD_IDS = {
    cliente: "nome_do_cliente",
    origem: "origem_da_nf",
    motorista: "motorista",
    ajudante: "ajudante",
    codigo: "codigo", // Adicionei o ID do campo código
    quantidade: "quatidade",
    descricao: "descri_o",
    observacao: "observa_o",
  };

  const atualizarProduto = (index, campo, valor) => {
    const novosProdutos = [...produtos];
    novosProdutos[index][campo] = valor;
    setProdutos(novosProdutos);
  };

  const limparFormulario = () => {
    setNomeCliente("");
    setOrigemNF("");
    setMotorista("");
    setAjudante("");
    setProdutos([
      { codigo: "", quantidade: "", descricao: "", observacao: "" },
    ]); // Atualizado
  };

  const enviarParaPipefy = async () => {
    if (!nomeCliente.trim() || !motorista.trim()) {
      // Corrigi o nome da variável (era nomeCliente)
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios");
      return;
    }

    const produto = produtos[0];

    if (!produto.quantidade.trim()) {
      Alert.alert("Atenção", "Preencha a quantidade do produto");
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
            { field_id: "${FIELD_IDS.origem}", field_value: "${origemNF.replace(
        /"/g,
        '\\"'
      )}" },
            { field_id: "${
              FIELD_IDS.motorista
            }", field_value: "${motorista.replace(/"/g, '\\"')}" },
            { field_id: "${
              FIELD_IDS.ajudante
            }", field_value: "${ajudante.replace(/"/g, '\\"')}" },
            { field_id: "${FIELD_IDS.codigo}", field_value: "${
        produto.codigo ? produto.codigo.replace(/"/g, '\\"') : ""
      }" },
            { field_id: "${
              FIELD_IDS.quantidade
            }", field_value: "${produto.quantidade.replace(/"/g, '\\"')}" },
            { field_id: "${FIELD_IDS.descricao}", field_value: "${
        produto.descricao ? produto.descricao.replace(/"/g, '\\"') : ""
      }" },
            { field_id: "${FIELD_IDS.observacao}", field_value: "${
        produto.observacao ? produto.observacao.replace(/"/g, '\\"') : ""
      }" }
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

      Alert.alert(
        "✅ Sucesso",
        `Card criado com ID: ${data.data.createCard.card.id}`
      );
      limparFormulario();
    } catch (error) {
      console.error("Erro:", error);
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

      {/* Cliente */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#7f8c8d" style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          value={nomeCliente}
          onChangeText={setNomeCliente}
          placeholder="Nome do cliente *"
          editable={!enviando}
        />
      </View>

      {/* Origem da NF */}
      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} color="#7f8c8d" style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          value={origemNF}
          onChangeText={setOrigemNF}
          placeholder="Origem da NF"
          editable={!enviando}
        />
      </View>

      {/* Motorista */}
      <View style={styles.inputContainer}>
        <Icon name="truck" size={20} color="#7f8c8d" style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          value={motorista}
          onChangeText={setMotorista}
          placeholder="Nome do motorista *"
          editable={!enviando}
        />
      </View>

      {/* Ajudante */}
      <View style={styles.inputContainer}>
        <Icon name="users" size={20} color="#7f8c8d" style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          value={ajudante}
          onChangeText={setAjudante}
          placeholder="Nome do ajudante"
          editable={!enviando}
        />
      </View>

      <Text style={[styles.secaoTitulo, { marginTop: 20 }]}>Produto</Text>

      {produtos.map((produto, index) => (
        <View key={index} style={styles.produtoContainer}>
          {/* Código - NOVO */}
          <View style={styles.inputContainer}>
            <Icon
              name="hash"
              size={20}
              color="#7f8c8d"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputWithIcon}
              value={produto.codigo}
              onChangeText={(text) => atualizarProduto(index, "codigo", text)}
              placeholder="Código"
              editable={!enviando}
            />
          </View>

          {/* Quantidade */}
          <View style={styles.inputContainer}>
            <Icon
              name="layers"
              size={20}
              color="#7f8c8d"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputWithIcon}
              value={produto.quantidade}
              onChangeText={(text) =>
                atualizarProduto(index, "quantidade", text)
              }
              placeholder="Quantidade *"
              keyboardType="numeric"
              editable={!enviando}
            />
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Icon
              name="file-text"
              size={20}
              color="#7f8c8d"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputWithIcon, styles.textArea]}
              value={produto.descricao}
              onChangeText={(text) =>
                atualizarProduto(index, "descricao", text)
              }
              placeholder="Descrição"
              multiline
              editable={!enviando}
            />
          </View>

          {/* Observação */}
          <View style={styles.inputContainer}>
            <Icon
              name="clipboard"
              size={20}
              color="#7f8c8d"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputWithIcon, styles.textArea]}
              value={produto.observacao}
              onChangeText={(text) =>
                atualizarProduto(index, "observacao", text)
              }
              placeholder="Observações"
              multiline
              editable={!enviando}
            />
          </View>
        </View>
      ))}

      {/* Botão */}
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

// Estilos (mantidos os mesmos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#34495e",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  inputIcon: {
    marginRight: 10,
    color: "#7f8c8d",
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
    color: "#2d3436",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "center",
    fontSize: 16,
    color: "#2d3436",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  produtoContainer: {
    marginBottom: 24,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  botaoPrimario: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botaoTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoDesabilitado: {
    backgroundColor: "#95a5a6",
  },
});

export default RegistroAtendimento;
