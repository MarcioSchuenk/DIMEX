import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface InputFieldProps {
  // Props do primeiro componente
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  maxLength?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad' | 'number-pad';
  rightIcon?: React.ComponentProps<typeof MaterialIcons>['name'];
  error?: boolean;
  errorMessage?: string;

  // Props do segundo componente
  label?: string;
  secureTextEntry?: boolean;
  onRightIconPress?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  placeholderTextColor?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  maxLength,
  keyboardType = 'default',
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  autoCapitalize = 'none',
  error = false,
  errorMessage,
  placeholderTextColor = '#9E9E9E',
}) => {
  return (
    <View style={styles.formGroup}>
      {label && <Text style={[styles.label, error && styles.errorText]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        error && styles.errorBorder,
      ]}>
        <MaterialIcons 
          name={icon} 
          size={20} 
          color={error ? '#F44336' : '#4CAF50'} 
          style={styles.inputIcon} 
        />
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          maxLength={maxLength}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <MaterialIcons
              name={rightIcon}
              size={20}
              color={error ? '#F44336' : '#757575'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#424242',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    includeFontPadding: false,
  },
  errorBorder: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
  },
  errorMessage: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
});