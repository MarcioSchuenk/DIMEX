// components/SubmitButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface SubmitButtonProps {
  onPress: () => void;
  label: string;
  iconName?: MaterialIconName;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  label,
  iconName = "send",
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
    <MaterialIcons name={iconName} size={20} color="#FFF" style={styles.icon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  icon: {
    marginLeft: 8,
  },
});
