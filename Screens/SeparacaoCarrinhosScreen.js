import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function FormularioPedidosScreen() {
  const initialFormState = {
    codigoSeparador: '',
    pedido01: '',
    pedido02: '',
    pedido03: '',
    pedido04: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({
    codigoSeparador: false,
    pedido01: false,
    pedido02: false,
    pedido03: false,
    pedido04: false
  });

  // Valida se o valor contém apenas números
  const validateNumber = (value) => {
    return /^\d*$/.test(value);
  };

  // Valida se o pedido tem exatamente 7 caracteres
  const validatePedidoLength = (value) => {
    return value.length === 0 || value.length === 7;
  };

  // Valida se o código do separador tem exatamente 6 dígitos
  const validateCodigoSeparadorLength = (value) => {
    return value.length === 6;
  };

  const handleChange = (field, value) => {
    if ((field === 'codigoSeparador' || field.startsWith('pedido')) && value !== '' && !validateNumber(value)) {
      return;
    }
    
    setFormData(prev => ({...prev, [field]: value}));
    
    if (errors[field] && value) {
      setErrors(prev => ({...prev, [field]: false}));
    }
  };

  const validateForm = () => {
    const newErrors = {
      codigoSeparador: !formData.codigoSeparador || !validateCodigoSeparadorLength(formData.codigoSeparador),
      pedido01: !formData.pedido01 || !validatePedidoLength(formData.pedido01),
      pedido02: formData.pedido02 !== '' && !validatePedidoLength(formData.pedido02),
      pedido03: formData.pedido03 !== '' && !validatePedidoLength(formData.pedido03),
      pedido04: formData.pedido04 !== '' && !validatePedidoLength(formData.pedido04)
    };
    
    setErrors(newErrors);
    
    return !newErrors.codigoSeparador && 
           !newErrors.pedido01 && 
           !newErrors.pedido02 && 
           !newErrors.pedido03 && 
           !newErrors.pedido04;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({
      codigoSeparador: false,
      pedido01: false,
      pedido02: false,
      pedido03: false,
      pedido04: false
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      let errorMessage = '';
      
      if (!formData.codigoSeparador) {
        errorMessage += '• Código do Separador é obrigatório\n';
      } else if (!validateCodigoSeparadorLength(formData.codigoSeparador)) {
        errorMessage += '• Código do Separador deve ter exatamente 6 dígitos\n';
      }
      if (!formData.pedido01) {
        errorMessage += '• Pedido 01 é obrigatório\n';
      }
      if (formData.pedido01 && !validatePedidoLength(formData.pedido01)) {
        errorMessage += '• Pedido 01 deve ter exatamente 7 dígitos\n';
      }
      if (formData.pedido02 && !validatePedidoLength(formData.pedido02)) {
        errorMessage += '• Pedido 02 deve ter exatamente 7 dígitos\n';
      }
      if (formData.pedido03 && !validatePedidoLength(formData.pedido03)) {
        errorMessage += '• Pedido 03 deve ter exatamente 7 dígitos\n';
      }
      if (formData.pedido04 && !validatePedidoLength(formData.pedido04)) {
        errorMessage += '• Pedido 04 deve ter exatamente 7 dígitos\n';
      }

      Alert.alert(
        'Erros no formulário',
        errorMessage,
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('Dados enviados:', formData);
    Alert.alert('Sucesso', 'Pedidos enviados com sucesso!', [
      { 
        text: 'OK', 
        onPress: () => resetForm() 
      }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registro de separação</Text>
      
      <View style={styles.card}>
        {/* Campo Código do Separador */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Código do Separador *</Text>
          <View style={[
            styles.inputContainer, 
            errors.codigoSeparador && styles.inputError
          ]}>
            <MaterialIcons name="person-pin" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.codigoSeparador}
              onChangeText={(text) => handleChange('codigoSeparador', text)}
              placeholder="Digite o codigo do separador (6 dígitos)"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          {errors.codigoSeparador && (
            <Text style={styles.errorText}>
              {formData.codigoSeparador.length === 0 
                ? 'Este campo é obrigatório' 
                : 'O código deve ter exatamente 6 dígitos'}
            </Text>
          )}
        </View>

        {/* Campo Pedido 01 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Pedido 01 *</Text>
          <View style={[
            styles.inputContainer, 
            (errors.pedido01 || (formData.pedido01 && !validatePedidoLength(formData.pedido01))) && styles.inputError
          ]}>
            <MaterialIcons name="shopping-cart" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.pedido01}
              onChangeText={(text) => handleChange('pedido01', text)}
              placeholder="Bipe o número do pedido (7 dígitos)"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              maxLength={7}
            />
          </View>
          {errors.pedido01 && (
            <Text style={styles.errorText}>Este campo é obrigatório</Text>
          )}
          {formData.pedido01 && !validatePedidoLength(formData.pedido01) && (
            <Text style={styles.errorText}>O pedido deve ter exatamente 7 dígitos</Text>
          )}
        </View>

        {/* Campo Pedido 02 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Pedido 02</Text>
          <View style={[
            styles.inputContainer, 
            (formData.pedido02 && !validatePedidoLength(formData.pedido02)) && styles.inputError
          ]}>
            <MaterialIcons name="shopping-cart" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.pedido02}
              onChangeText={(text) => handleChange('pedido02', text)}
              placeholder="Bipe o número do pedido (7 dígitos)"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              maxLength={7}
            />
          </View>
          {formData.pedido02 && !validatePedidoLength(formData.pedido02) && (
            <Text style={styles.errorText}>O pedido deve ter exatamente 7 dígitos</Text>
          )}
        </View>

        {/* Campo Pedido 03 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Pedido 03</Text>
          <View style={[
            styles.inputContainer, 
            (formData.pedido03 && !validatePedidoLength(formData.pedido03)) && styles.inputError
          ]}>
            <MaterialIcons name="shopping-cart" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.pedido03}
              onChangeText={(text) => handleChange('pedido03', text)}
              placeholder="Bipe o número do pedido (7 dígitos)"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              maxLength={7}
            />
          </View>
          {formData.pedido03 && !validatePedidoLength(formData.pedido03) && (
            <Text style={styles.errorText}>O pedido deve ter exatamente 7 dígitos</Text>
          )}
        </View>

        {/* Campo Pedido 04 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Pedido 04</Text>
          <View style={[
            styles.inputContainer, 
            (formData.pedido04 && !validatePedidoLength(formData.pedido04)) && styles.inputError
          ]}>
            <MaterialIcons name="shopping-cart" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.pedido04}
              onChangeText={(text) => handleChange('pedido04', text)}
              placeholder="Bipe o número do pedido (7 dígitos)"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              maxLength={7}
            />
          </View>
          {formData.pedido04 && !validatePedidoLength(formData.pedido04) && (
            <Text style={styles.errorText}>O pedido deve ter exatamente 7 dígitos</Text>
          )}
        </View>
      </View>

      {/* Botão de Envio */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>ENVIAR</Text>
        <MaterialIcons name="send" size={20} color="#FFFFFF" style={styles.buttonIcon} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#1B5E2040',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
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
  inputError: {
    borderColor: '#F44336',
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
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
});