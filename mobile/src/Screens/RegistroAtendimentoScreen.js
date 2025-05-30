import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

const FIELD_IDS = {
  cliente: "nome_do_cliente",
  origem: "origem_da_nf",
  motorista: "motorista",
  ajudante: "ajudante",
  codigo: "codigo",
  quantidade: "quatidade",
  descricao: "descri_o",
  observacao: "observa_o",
  url_imagem: "url_da_imagem",
};

// Configurações - substitua pelos seus valores reais
const CLOUDINARY_CONFIG = {
  cloudName: "dilivah9m",
  uploadPreset: "Upload_preset_pedro",
};

const PIPEFY_CONFIG = {
  token:
    "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaXBlZnkiLCJpYXQiOjE3NDc4NjQ0NDEsImp0aSI6IjNiZTU3MGFiLTY3MjMtNDI0MS04OWIwLWJiYmNiNjIyNTBiMCIsInN1YiI6MzA1NjQ5NTY0LCJ1c2VyIjp7ImlkIjozMDU2NDk1NjQsImVtYWlsIjoicGVkcm8uZUBncnVwb2RpbWUuY29tLmJyIn19.61GdOq6PRR_Hi88sxNfZdJ7HUdSlxct-H-q6fGMLkcZ8gZFlNcPBPzsWO45S6QZz7BryZAlpWhROzuiSbmgOmw",
  pipeId: "306350886",
};

export const FormularioApp = () => {
  const [formData, setFormData] = useState({
    cliente: "",
    origem: "",
    motorista: "",
    ajudante: "",
    codigo: "",
    quantidade: "",
    descricao: "",
    observacao: "",
    url_imagem: "",
  });

  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para usar a câmera"
      );
      return false;
    }
    return true;
  };

  const tirarFoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
        maxWidth: 1024, // Limita a largura (ajuste conforme necessidade)
        maxHeight: 1024,
        selectionLimit: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageUploaded(false);
        uploadToCloudinary(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível tirar a foto");
    }
  };

  const uploadToCloudinary = async (uri) => {
    setIsUploading(true);

    try {
      console.log("Iniciando upload para Cloudinary...");
      console.log("Cloud Name:", CLOUDINARY_CONFIG.cloudName);
      console.log("Upload Preset:", CLOUDINARY_CONFIG.uploadPreset);

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: `photo_${Date.now()}.jpg`,
      });
      formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
      formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Resposta Cloudinary:", data);

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          url_imagem: data.secure_url,
        }));
        setImageUploaded(true);
        Alert.alert("Sucesso", "Imagem enviada com sucesso!");
        console.log("URL da imagem:", data.secure_url);
      } else {
        console.error("Erro detalhado Cloudinary:", data);
        let errorMessage = "Erro no upload";

        if (data.error) {
          errorMessage =
            data.error.message || "Erro desconhecido do Cloudinary";
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Erro completo:", error);
      Alert.alert("Erro Cloudinary", `Falha no upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const enviarParaPipefy = async () => {
    // Validar campos obrigatórios
    const camposObrigatorios = [
      { campo: "cliente", nome: "Nome do Cliente" },
      { campo: "origem", nome: "Origem da NF" },
      { campo: "motorista", nome: "Motorista" },
      { campo: "ajudante", nome: "Ajudante" },
      { campo: "codigo", nome: "Código" },
      { campo: "quantidade", nome: "Quantidade" },
      { campo: "descricao", nome: "Descrição" },
      { campo: "observacao", nome: "Observação" },
    ];

    const camposVazios = camposObrigatorios.filter(
      (item) => !formData[item.campo].trim()
    );

    if (camposVazios.length > 0) {
      const nomesCampos = camposVazios.map((item) => item.nome).join(", ");
      Alert.alert(
        "Campos Obrigatórios",
        `Por favor, preencha os seguintes campos: ${nomesCampos}`
      );
      return;
    }

    if (!imageUploaded) {
      Alert.alert("Atenção", "É obrigatório tirar uma foto antes de enviar");
      return;
    }

    setIsSending(true);

    try {
      const mutation = `
        mutation {
          createCard(input: {
            pipe_id: "${PIPEFY_CONFIG.pipeId}"
            fields_attributes: [
              {field_id: "${FIELD_IDS.cliente}", field_value: "${formData.cliente}"}
              {field_id: "${FIELD_IDS.origem}", field_value: "${formData.origem}"}
              {field_id: "${FIELD_IDS.motorista}", field_value: "${formData.motorista}"}
              {field_id: "${FIELD_IDS.ajudante}", field_value: "${formData.ajudante}"}
              {field_id: "${FIELD_IDS.codigo}", field_value: "${formData.codigo}"}
              {field_id: "${FIELD_IDS.quantidade}", field_value: "${formData.quantidade}"}
              {field_id: "${FIELD_IDS.descricao}", field_value: "${formData.descricao}"}
              {field_id: "${FIELD_IDS.observacao}", field_value: "${formData.observacao}"}
              {field_id: "${FIELD_IDS.url_imagem}", field_value: "${formData.url_imagem}"}
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
          Authorization: `Bearer ${PIPEFY_CONFIG.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();

      if (result.data?.createCard?.card) {
        Alert.alert("Sucesso", "Formulário enviado com sucesso para o Pipefy!");
        // Limpar formulário
        setFormData({
          cliente: "",
          origem: "",
          motorista: "",
          ajudante: "",
          codigo: "",
          quantidade: "",
          descricao: "",
          observacao: "",
          url_imagem: "",
        });
        setImageUri(null);
        setImageUploaded(false);
      } else {
        throw new Error("Erro na resposta do Pipefy");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar para o Pipefy");
      console.error("Erro Pipefy:", error);
    } finally {
      setIsSending(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Formulário de Entrega</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Cliente *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="person"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={formData.cliente}
              onChangeText={(text) => updateField("cliente", text)}
              placeholder="Digite o nome do cliente"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Origem da NF *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="assignment"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={formData.origem}
              onChangeText={(text) => updateField("origem", text)}
              placeholder="Origem da Nota Fiscal"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Motorista *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="local-shipping"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={formData.motorista}
              onChangeText={(text) => updateField("motorista", text)}
              placeholder="Nome do motorista"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ajudante *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="people"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={formData.ajudante}
              onChangeText={(text) => updateField("ajudante", text)}
              placeholder="Nome do ajudante"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Código *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="qr-code"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={formData.codigo}
              onChangeText={(text) => updateField("codigo", text)}
              placeholder="Código do produto"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantidade *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="format-list-numbered"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={formData.quantidade}
              onChangeText={(text) => updateField("quantidade", text)}
              placeholder="Quantidade"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="description"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(text) => updateField("descricao", text)}
              placeholder="Descrição do produto"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observação *</Text>
          <View style={styles.inputWithIcon}>
            <Icon
              name="comment"
              size={23}
              color="#4CAF50"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.observacao}
              onChangeText={(text) => updateField("observacao", text)}
              placeholder="Observações adicionais"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.imageSection}>
          <Text style={styles.label}>Foto do Produto *</Text>

          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={tirarFoto}
            disabled={isUploading}
          >
            <View style={styles.cameraIconCircle}>
              <Icon name="photo-camera" size={23} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          {imageUri && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.uploadingText}>Enviando...</Text>
                </View>
              )}
              {imageUploaded && (
                <View style={styles.uploadedBadge}>
                  <Text style={styles.uploadedText}>✅ Enviado</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!imageUploaded || isSending) && styles.submitButtonDisabled,
          ]}
          onPress={enviarParaPipefy}
          disabled={!imageUploaded || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>
                {imageUploaded
                  ? " Enviar para Pipefy"
                  : " Aguarde upload da imagem"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Set white as primary background
  },

  scrollView: {
    flex: 1,
    backgroundColor: "white", // Set white as primary background
  },

  header: {
    backgroundColor: "white", // Changed from #F5F5F5 to white
    padding: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4CAF50", // Changed to your specified green
    textAlign: "center",
  },

  formContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  textArea: {
    height: 80,
    textAlignVertical: "center",
  },

  imageSection: {
    marginBottom: 25,
  },

  imageButtons: {
    marginBottom: 15,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 0,
  },

  cameraButton: {
    backgroundColor: "#4CAF50", // Changed to your specified green
    marginBottom: 20,
  },

  galleryButton: {
    backgroundColor: "#4CAF50", // Changed to your specified green
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  imagePreview: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },

  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },

  uploadedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#4CAF50", // Changed to your specified green
    padding: 8,
    borderRadius: 8,
  },

  uploadedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  submitButton: {
    backgroundColor: "#4CAF50", // Changed to your specified green
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  submitButtonDisabled: {
    backgroundColor: "#95a5a6",
  },

  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },

  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "black",
  },

  buttonIcon: {
    marginRight: 10,
  },

  cameraIconCircle: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
