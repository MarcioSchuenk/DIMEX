// components/FloatingActionButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  onPress: () => void;
  position: 'left' | 'right';
  color?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onPress,
  position,
  color = '#4CAF50',
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      position === 'left' ? styles.leftButton : styles.rightButton,
      { backgroundColor: color },
    ]}
    onPress={onPress}
  >
    <MaterialIcons name={icon} size={24} color="#FFFFFF" />
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 63,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  leftButton: {
    left: 24,
  },
  rightButton: {
    right: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
    marginLeft: 8,
  },
});