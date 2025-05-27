import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface AddItemButtonProps {
  onPress: () => void;
  label: string;
  disabled?: boolean;
}

export const AddItemButton: React.FC<AddItemButtonProps> = ({
  onPress,
  label,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <MaterialIcons name="add-circle" size={24} color="#4CAF50" />
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#4CAF50",
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
