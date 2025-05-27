import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// Configurações constantes
const PIPE_CONFIG = {
  PIPE_ID: "306350886",
  API_TOKEN:
    "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaXBlZnkiLCJpYXQiOjE3NDc4NjQ0NDEsImp0aSI6IjNiZTU3MGFiLTY3MjMtNDI0MS04OWIwLWJiYmNiNjIyNTBiMCIsInN1YiI6MzA1NjQ5NTY0LCJ1c2VyIjp7ImlkIjozMDU2NDk1NjQsImVtYWlsIjoicGVkcm8uZUBncnVwb2RpbWUuY29tLmJyIn19.61GdOq6PRR_Hi88sxNfZdJ7HUdSlxct-H-q6fGMLkcZ8gZFlNcPBPzsWO45S6QZz7BryZAlpWhROzuiSbmgOmw",
  GRAPHQL_API: "https://api.pipefy.com/graphql",
  ORGANIZATION_ID: "301555293",
  FIELD_IDS: {
    cliente: "nome_do_cliente",
    origem: "origem_da_nf",
    motorista: "motorista",
    ajudante: "ajudante",
    codigo: "codigo",
    quantidade: "quatidade",
    descricao: "descri_o",
    observacao: "observa_o",
    url_imagem: "url_da_imagem",
  },
};

// Configurações do Cloudinary
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dilivah9m", // Substitua pelo seu cloud name
  UPLOAD_PRESET: "mobile_upload", // Opcional
  UPLOAD_URL: "https://api.cloudinary.com/v1_1/dilivah9m/upload", // Substitua pelo seu cloud name
};

const INITIAL_STATE = {
  cliente: "",
  origem: "",
  motorista: "",
  ajudante: "",
  produto: {
    codigo: "",
    quantidade: "",
    descricao: "",
    observacao: "",
  },
};

const RegistroAtendimento = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [imageData, setImageData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      console.log("Solicitando permissão da câmera...");
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
      console.log(`Permissão da câmera: ${status}`);
    };

    requestCameraPermission();
  }, []);

  const handleInputChange = (field, value) => {
    console.log(`Alterando campo ${field} para:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (field, value) => {
    console.log(`Alterando campo produto.${field} para:`, value);
    setFormData((prev) => ({
      ...prev,
      produto: { ...prev.produto, [field]: value },
    }));
  };

  const takePhoto = async () => {
    console.log("Iniciando captura de foto...");

    if (!hasCameraPermission) {
      console.warn("Permissão da câmera negada");
      Alert.alert(
        "Permissão necessária",
        "Por favor, conceda permissão para acessar a câmera"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // <-- DESABILITA o corte
        quality: 0.8,
      });

      console.log("Resultado da câmera:", result);

      if (!result.canceled && result.assets?.length) {
        console.log("Processando imagem selecionada...");
        await processImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Erro na câmera:", error);
      Alert.alert("Erro", "Falha ao acessar a câmera");
    }
  };

  const processImage = async (file) => {
    try {
      console.log("Processando imagem:", file.uri);
      const fileInfo = await FileSystem.getInfoAsync(file.uri);

      if (!fileInfo.exists) {
        throw new Error("Arquivo de imagem não encontrado");
      }

      const fileName =
        file.fileName || file.uri.split("/").pop() || `photo_${Date.now()}.jpg`;
      const fileType =
        file.mimeType || `image/${fileName.split(".").pop() || "jpeg"}`;

      console.log("Dados da imagem:", {
        uri: file.uri,
        name: fileName,
        type: fileType,
        size: fileInfo.size,
      });

      setImageData({
        uri: file.uri,
        name: fileName,
        type: fileType,
      });
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      Alert.alert("Erro", "Falha ao processar imagem");
      setImageData(null);
    }
  };

  const resetForm = () => {
    console.log("Resetando formulário...");
    setFormData(INITIAL_STATE);
    setImageData(null);
  };

  const validateForm = () => {
    if (!formData.cliente.trim()) {
      console.warn("Validação falhou: Nome do cliente obrigatório");
      Alert.alert("Atenção", "Nome do cliente é obrigatório");
      return false;
    }

    if (!formData.motorista.trim()) {
      console.warn("Validação falhou: Nome do motorista obrigatório");
      Alert.alert("Atenção", "Nome do motorista é obrigatório");
      return false;
    }

    if (!formData.produto.quantidade.trim()) {
      console.warn("Validação falhou: Quantidade do produto obrigatória");
      Alert.alert("Atenção", "Quantidade do produto é obrigatória");
      return false;
    }

    console.log("Validação do formulário OK");
    return true;
  };

  const uploadToCloudinary = async () => {
    const formDataRef = formData;

    if (!imageData) {
      console.log("Nenhuma imagem para upload");
      return null;
    }

    console.log("Iniciando upload para Cloudinary...");

    try {
      const formData = new FormData();

      // Nome personalizado: Motorista_Codigo
      const nomeMotorista =
        formDataRef.motorista?.replace(/\s+/g, "_") || "motorista";
      const codigoProduto = formDataRef.produto?.codigo || "codigo";
      const nomeImagem = `${nomeMotorista}_${codigoProduto}`;

      formData.append("file", {
        uri: imageData.uri,
        name: `${nomeImagem}.jpg`,
        type: imageData.type,
      });

      formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
      formData.append("folder", "Relatorio de Atendimento"); // <-- Pasta desejada
      formData.append("public_id", nomeImagem); // <-- Nome personalizado da imagem

      console.log("Enviando para Cloudinary...");
      const response = await fetch(CLOUDINARY_CONFIG.UPLOAD_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro no upload para Cloudinary:", errorData);
        throw new Error(errorData.message || "Falha no upload para Cloudinary");
      }

      const data = await response.json();
      console.log("Upload para Cloudinary concluído:", data);

      return data.secure_url;
    } catch (error) {
      console.error("Erro no upload para Cloudinary:", error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  };

  const createPipefyCard = async (imageUrl = null) => {
    console.log("Criando card no Pipefy...", { imageUrl });

    // Preparar campos básicos
    const baseFields = [
      {
        field_id: PIPE_CONFIG.FIELD_IDS.cliente,
        field_value: formData.cliente,
      },
      { field_id: PIPE_CONFIG.FIELD_IDS.origem, field_value: formData.origem },
      {
        field_id: PIPE_CONFIG.FIELD_IDS.motorista,
        field_value: formData.motorista,
      },
      {
        field_id: PIPE_CONFIG.FIELD_IDS.ajudante,
        field_value: formData.ajudante,
      },
      {
        field_id: PIPE_CONFIG.FIELD_IDS.codigo,
        field_value: formData.produto.codigo,
      },
      {
        field_id: PIPE_CONFIG.FIELD_IDS.quantidade,
        field_value: formData.produto.quantidade,
      },
      {
        field_id: PIPE_CONFIG.FIELD_IDS.descricao,
        field_value: formData.produto.descricao,
      },
      {
        field_id: PIPE_CONFIG.FIELD_IDS.observacao,
        field_value: formData.produto.observacao,
      },
    ];

    // Adicionar URL da imagem se existir
    if (imageUrl) {
      console.log("Adicionando URL da imagem ao card:", imageUrl);
      baseFields.push({
        field_id: PIPE_CONFIG.FIELD_IDS.url_imagem, // Usando o campo específico de URL
        field_value: imageUrl, // Enviar apenas a URL como string
      });
    }

    console.log("Campos a serem enviados:", baseFields);

    const mutation = `
      mutation {
        createCard(input: {
          pipe_id: "${PIPE_CONFIG.PIPE_ID}",
          fields_attributes: ${JSON.stringify(baseFields).replace(
            /"([^"]+)":/g,
            "$1:"
          )}
        }) {
          card { id }
        }
      }
    `;

    console.log("Mutation GraphQL:", mutation);

    try {
      const response = await fetch(PIPE_CONFIG.GRAPHQL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PIPE_CONFIG.API_TOKEN}`,
        },
        body: JSON.stringify({ query: mutation }),
      });

      console.log("Resposta da criação do card:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("Resposta não OK:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data, errors } = await response.json();
      console.log("Resposta completa:", { data, errors });

      if (errors) {
        throw new Error(errors.map((err) => err.message).join(", "));
      }

      const cardId = data.createCard.card.id;
      console.log("Card criado com sucesso. ID:", cardId);
      return cardId;
    } catch (error) {
      console.error("Falha ao criar card:", error);
      throw new Error(`Falha na criação do card: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    console.log("Iniciando envio do formulário...");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log("Processando imagem...");
      const imageUrl = await uploadToCloudinary();

      console.log("Criando card...");
      const cardId = await createPipefyCard(imageUrl);

      Alert.alert("Sucesso", `Registro enviado! ID: ${cardId}`);
      resetForm();
    } catch (error) {
      console.error("Erro no envio:", error);
      Alert.alert("Erro", error.message || "Falha ao enviar registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderização
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Registro de Atendimento</Text>

      {/* Campos principais */}
      {[
        { icon: "user", field: "cliente", placeholder: "Nome do cliente *" },
        { icon: "mail", field: "origem", placeholder: "Origem da NF" },
        { icon: "truck", field: "motorista", placeholder: "Motorista *" },
        { icon: "users", field: "ajudante", placeholder: "Ajudante" },
      ].map(({ icon, field, placeholder }) => (
        <View key={field} style={styles.inputContainer}>
          <Icon name={icon} size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData[field]}
            onChangeText={(text) => handleInputChange(field, text)}
            placeholder={placeholder}
            editable={!isSubmitting}
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Produto</Text>

      {/* Campos do produto */}
      {[
        { icon: "hash", field: "codigo", placeholder: "Código" },
        {
          icon: "layers",
          field: "quantidade",
          placeholder: "Quantidade *",
          keyboardType: "numeric",
        },
        {
          icon: "file-text",
          field: "descricao",
          placeholder: "Descrição",
          multiline: true,
        },
        {
          icon: "clipboard",
          field: "observacao",
          placeholder: "Observações",
          multiline: true,
        },
      ].map(({ icon, field, placeholder, ...props }) => (
        <View key={field} style={styles.inputContainer}>
          <Icon name={icon} size={20} style={styles.icon} />
          <TextInput
            style={[styles.input, props.multiline && styles.multilineInput]}
            value={formData.produto[field]}
            onChangeText={(text) => handleProductChange(field, text)}
            placeholder={placeholder}
            editable={!isSubmitting}
            {...props}
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Foto</Text>

      <TouchableOpacity
        style={[styles.secondaryButton, isSubmitting && styles.disabledButton]}
        onPress={takePhoto}
        disabled={isSubmitting}
      >
        <Icon
          name="camera"
          size={20}
          color="#3498db"
          style={styles.buttonIcon}
        />
        <Text style={styles.secondaryButtonText}>
          {imageData ? "Substituir Foto" : "Tirar Foto"}
        </Text>
      </TouchableOpacity>

      {imageData && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageData.uri }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setImageData(null)}
          >
            <Icon name="x" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Enviando..." : "Enviar para Pipefy"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Estilos (mantidos iguais)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#34495e",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  icon: {
    marginRight: 10,
    color: "#7f8c8d",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2d3436",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3498db",
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  secondaryButtonText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
    borderColor: "#95a5a6",
  },
  imageContainer: {
    marginTop: 15,
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
});

export default RegistroAtendimento;
