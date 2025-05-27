import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// Constants
const CONFIG = {
  PIPEFY: {
    PIPE_ID: "306350886",
    API_TOKEN: "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJQaXBlZnkiLCJpYXQiOjE3NDc4NjQ0NDEsImp0aSI6IjNiZTU3MGFiLTY3MjMtNDI0MS04OWIwLWJiYmNiNjIyNTBiMCIsInN1YiI6MzA1NjQ5NTY0LCJ1c2VyIjp7ImlkIjozMDU2NDk1NjQsImVtYWlsIjoicGVkcm8uZUBncnVwb2RpbWUuY29tLmJyIn19.61GdOq6PRR_Hi88sxNfZdJ7HUdSlxct-H-q6fGMLkcZ8gZFlNcPBPzsWO45S6QZz7BryZAlpWhROzuiSbmgOmw",
    API_URL: "https://api.pipefy.com/graphql",
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
  },
  CLOUDINARY: {
    CLOUD_NAME: "dilivah9m",
    UPLOAD_PRESET: "mobile_upload",
    UPLOAD_URL: "https://api.cloudinary.com/v1_1/dilivah9m/upload",
    FOLDER: "Relatorio de Atendimento",
  },
  IMAGE: {
    QUALITY: 0.6, // Reduzido para melhor performance
    MAX_WIDTH: 1024, // Limitando resolução
    MAX_HEIGHT: 768,
  }
};

const INITIAL_FORM_STATE = {
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

const FORM_FIELDS = [
  { 
    icon: "user", 
    field: "cliente", 
    placeholder: "Nome do cliente *",
    required: true 
  },
  { 
    icon: "mail", 
    field: "origem", 
    placeholder: "Origem da NF *",
    required: true 
  },
  { 
    icon: "truck", 
    field: "motorista", 
    placeholder: "Motorista *",
    required: true 
  },
  { 
    icon: "users", 
    field: "ajudante", 
    placeholder: "Ajudante *",
    required: true 
  },
];

const PRODUCT_FIELDS = [
  { 
    icon: "hash", 
    field: "codigo", 
    placeholder: "Código *",
    keyboardType: "numeric",
    required: true 
  },
  {
    icon: "layers",
    field: "quantidade",
    placeholder: "Quantidade *",
    keyboardType: "numeric",
    required: true 
  },
  {
    icon: "file-text",
    field: "descricao",
    placeholder: "Descrição *",
    multiline: true,
    required: true 
  },
  {
    icon: "clipboard",
    field: "observacao",
    placeholder: "Observações *",
    multiline: true,
    required: true 
  },
];

// Validation Utils
const validateRequiredField = (value, fieldName) => {
  if (!value?.toString().trim()) {
    throw new Error(`${fieldName} é obrigatório`);
  }
};

const validateForm = (formData) => {
  try {
    validateRequiredField(formData.cliente, "Nome do cliente");
    validateRequiredField(formData.origem, "Origem da NF");
    validateRequiredField(formData.motorista, "Motorista");
    validateRequiredField(formData.ajudante, "Ajudante");
    validateRequiredField(formData.produto.codigo, "Código do produto");
    validateRequiredField(formData.produto.quantidade, "Quantidade");
    validateRequiredField(formData.produto.descricao, "Descrição do produto");
    validateRequiredField(formData.produto.observacao, "Observações");
    return true;
  } catch (error) {
    Alert.alert("Campo obrigatório", error.message);
    return false;
  }
};

// Image Utils
const createImageFileName = (motorista, codigo) => {
  const cleanMotorista = motorista?.replace(/\s+/g, "_") || "motorista";
  const cleanCodigo = codigo || Date.now().toString();
  return `${cleanMotorista}_${cleanCodigo}`;
};

const createImageFormData = (imageData, fileName) => {
  const formData = new FormData();
  
  formData.append("file", {
    uri: imageData.uri,
    name: `${fileName}.jpg`,
    type: imageData.type,
  });
  
  formData.append("upload_preset", CONFIG.CLOUDINARY.UPLOAD_PRESET);
  formData.append("folder", CONFIG.CLOUDINARY.FOLDER);
  formData.append("public_id", fileName);
  
  return formData;
};

// API Utils
const uploadImageToCloudinary = async (imageData, formData) => {
  if (!imageData) return null;

  const fileName = createImageFileName(
    formData.motorista, 
    formData.produto.codigo
  );
  
  const uploadData = createImageFormData(imageData, fileName);

  const response = await fetch(CONFIG.CLOUDINARY.UPLOAD_URL, {
    method: "POST",
    body: uploadData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha no upload da imagem");
  }

  const data = await response.json();
  return data.secure_url;
};

const createPipefyFields = (formData, imageUrl) => {
  const baseFields = [
    { field_id: CONFIG.PIPEFY.FIELD_IDS.cliente, field_value: formData.cliente },
    { field_id: CONFIG.PIPEFY.FIELD_IDS.origem, field_value: formData.origem },
    { field_id: CONFIG.PIPEFY.FIELD_IDS.motorista, field_value: formData.motorista },
    { field_id: CONFIG.PIPEFY.FIELD_IDS.ajudante, field_value: formData.ajudante },
    { field_id: CONFIG.PIPEFY.FIELD_IDS.codigo, field_value: formData.produto.codigo },
    { field_id: CONFIG.PIPEFY.FIELD_IDS.quantidade, field_value: formData.produto.quantidade },
    { field_id: CONFIG.PIPEFY.FIELD_IDS.descricao, field_value: formData.produto.descricao },
    { field_id: CONFIG.PIPEFY.FIELD_IDS.observacao, field_value: formData.produto.observacao },
  ];

  if (imageUrl) {
    baseFields.push({
      field_id: CONFIG.PIPEFY.FIELD_IDS.url_imagem,
      field_value: imageUrl,
    });
  }

  return baseFields;
};

const createPipefyCard = async (formData, imageUrl) => {
  const fields = createPipefyFields(formData, imageUrl);
  
  const mutation = `
    mutation {
      createCard(input: {
        pipe_id: "${CONFIG.PIPEFY.PIPE_ID}",
        fields_attributes: ${JSON.stringify(fields).replace(/"([^"]+)":/g, "$1:")}
      }) {
        card { id }
      }
    }
  `;

  const response = await fetch(CONFIG.PIPEFY.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CONFIG.PIPEFY.API_TOKEN}`,
    },
    body: JSON.stringify({ query: mutation }),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors.map(err => err.message).join(", "));
  }

  return data.createCard.card.id;
};

// Custom Hooks
const useImagePicker = () => {
  const [imageData, setImageData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestPermissions = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  }, []);

  const processImage = useCallback(async (asset) => {
    setIsProcessing(true);
    
    try {
      // Verificar se o arquivo existe
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      if (!fileInfo.exists) {
        throw new Error("Arquivo não encontrado");
      }

      const fileName = asset.fileName || 
        asset.uri.split("/").pop() || 
        `photo_${Date.now()}.jpg`;
      
      const fileType = asset.mimeType || 
        `image/${fileName.split(".").pop() || "jpeg"}`;

      setImageData({
        uri: asset.uri,
        name: fileName,
        type: fileType,
      });
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      Alert.alert("Erro", "Falha ao processar imagem");
      setImageData(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const hasPermission = await requestPermissions();
    
    if (!hasPermission) {
      Alert.alert("Permissão necessária", "Acesso à câmera é obrigatório");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: CONFIG.IMAGE.QUALITY,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets?.[0]) {
        await processImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Erro na câmera:", error);
      Alert.alert("Erro", "Falha ao acessar câmera");
    }
  }, [processImage, requestPermissions]);

  const removeImage = useCallback(() => {
    setImageData(null);
  }, []);

  return {
    imageData,
    isProcessing,
    takePhoto,
    removeImage,
  };
};

// Components
const FormInput = React.memo(({ 
  icon, 
  value, 
  onChangeText, 
  placeholder, 
  disabled,
  keyboardType,
  multiline 
}) => (
  <View style={styles.inputContainer}>
    <Icon name={icon} size={20} style={styles.icon} />
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={!disabled}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
  </View>
));

const ImagePreview = React.memo(({ imageData, onRemove }) => {
  if (!imageData) return null;

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageData.uri }} style={styles.image} />
      <TouchableOpacity style={styles.removeImageButton} onPress={onRemove}>
        <Icon name="x" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
});

// Main Component
const RegistroAtendimento = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { imageData, isProcessing, takePhoto, removeImage } = useImagePicker();

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleProductChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      produto: { ...prev.produto, [field]: value },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    removeImage();
  }, [removeImage]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm(formData)) return;

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadImageToCloudinary(imageData, formData);
      const cardId = await createPipefyCard(formData, imageUrl);
      
      Alert.alert("Sucesso", `Registro enviado com sucesso!\nID: ${cardId}`);
      resetForm();
    } catch (error) {
      console.error("Erro no envio:", error);
      Alert.alert("Erro", error.message || "Falha ao enviar registro");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, imageData, resetForm]);

  const isFormDisabled = useMemo(() => 
    isSubmitting || isProcessing, 
    [isSubmitting, isProcessing]
  );

  const submitButtonText = useMemo(() => {
    if (isProcessing) return "Processando imagem...";
    if (isSubmitting) return "Enviando...";
    return "Enviar para Pipefy";
  }, [isProcessing, isSubmitting]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Registro de Atendimento</Text>

      {/* Campos principais */}
      {FORM_FIELDS.map(({ icon, field, placeholder, keyboardType }) => (
        <FormInput
          key={field}
          icon={icon}
          value={formData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={placeholder}
          disabled={isFormDisabled}
          keyboardType={keyboardType}
        />
      ))}

      <Text style={styles.sectionTitle}>Produto</Text>

      {/* Campos do produto */}
      {PRODUCT_FIELDS.map(({ icon, field, placeholder, keyboardType, multiline }) => (
        <FormInput
          key={field}
          icon={icon}
          value={formData.produto[field]}
          onChangeText={(text) => handleProductChange(field, text)}
          placeholder={placeholder}
          disabled={isFormDisabled}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      ))}

      <Text style={styles.sectionTitle}>Foto *</Text>

      <TouchableOpacity
        style={[styles.secondaryButton, isFormDisabled && styles.disabledButton]}
        onPress={takePhoto}
        disabled={isFormDisabled}
      >
        <Icon name="camera" size={20} color="#3498db" style={styles.buttonIcon} />
        <Text style={styles.secondaryButtonText}>
          {imageData ? "Substituir Foto" : "Tirar Foto"}
        </Text>
      </TouchableOpacity>

      <ImagePreview imageData={imageData} onRemove={removeImage} />

      <TouchableOpacity
        style={[styles.primaryButton, isFormDisabled && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isFormDisabled}
      >
        <Text style={styles.buttonText}>{submitButtonText}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default RegistroAtendimento;