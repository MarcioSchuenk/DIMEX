// components/CardButton.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CardButtonProps {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}

export const CardButton: React.FC<CardButtonProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress 
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.iconContainer}>
      <MaterialIcons name={icon} size={28} color="#FFFFFF" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.cardText}>{title}</Text>
      <Text style={styles.cardSubtext}>{subtitle}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#1B5E2040',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  iconContainer: {
    backgroundColor: '#4CAF50',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '600',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
});