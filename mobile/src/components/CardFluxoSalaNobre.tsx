// components/Card.tsx
import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.card, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
});