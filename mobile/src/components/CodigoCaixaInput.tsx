// components/CodigoCaixaInput.tsx
import React from "react";
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";


interface CodigoCaixaInputProps {
  value: string;
  error?: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?: string;
  iconName?: React.ComponentProps<typeof MaterialIcons>["name"];
  maxLength?: number;
}

export const CodigoCaixaInput: React.FC<CodigoCaixaInputProps> = ({
  value,
  error = "",
  onChange,
  label = "Código da Caixa *",
  placeholder = "Bipe o código da caixa. EX:CX123456",
  iconName = "qr-code",
  maxLength = 8,
}) => {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <MaterialIcons
          name={iconName}
          size={20}
          color="#4CAF50"
          style={styles.inputIcon}
        />
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          autoFocus
          maxLength={maxLength}
          autoCapitalize="characters"
        />
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// Tipagem para os estilos
interface Styles {
  formGroup: ViewStyle;
  label: TextStyle;
  inputContainer: ViewStyle;
  inputError: ViewStyle;
  inputIcon: ViewStyle;
  input: TextStyle;
  errorText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
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
    fontSize: RFValue(12),
    color: "#212121",
    includeFontPadding: false,
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
});