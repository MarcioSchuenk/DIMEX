import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function FormularioPedidosScreen() {
  const [codigoSeparador, setCodigoSeparador] = useState('');
  const [codigoSeparadorError, setCodigoSeparadorError] = useState(false);
  
  // Array para gerenciar pedidos dinamicamente
  const [pedidos, setPedidos] = useState([{ id: 1, valor: '', hasError: false }]);

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

  const handleCodigoSeparadorChange = (value) => {
    if (value !== '' && !validateNumber(value)) {
      return;
    }
    
    setCodigoSeparador(value);
    
    if (codigoSeparadorError && value.length === 6) {
      setCodigoSeparadorError(false);
    }
  };

  const handlePedidoChange = (id, value) => {
    if (value !== '' && !validateNumber(value)) {
      return;
    }
    
    const updatedPedidos = pedidos.map(pedido => {
      if (pedido.id === id) {
        const hasError = value !== '' && !validatePedidoLength(value);
        return { ...pedido, valor: value, hasError };
      }
      return pedido;
    });
    
    setPedidos(updatedPedidos);
  };

  const adicionarPedido = () => {
    // Não permitir adicionar mais do que 5 pedidos
    if (pedidos.length >= 5) return;
    
    // Encontrar o maior ID atual para garantir que o novo ID seja sempre único
    const maxId = Math.max(...pedidos.map(p => p.id), 0);
    setPedidos([...pedidos, { id: maxId + 1, valor: '', hasError: false }]);
  };

  const removerPedido = (id) => {
    // Não permitir remover o primeiro pedido
    if (pedidos.length === 1) {
      return;
    }
    
    const updatedPedidos = pedidos.filter(pedido => pedido.id !== id);
    setPedidos(updatedPedidos);
  };

  const validateForm = () => {
    // Validar código do separador
    const codigoInvalido = !codigoSeparador || !validateCodigoSeparadorLength(codigoSeparador);
    setCodigoSeparadorError(codigoInvalido);
    
    // Validar pedidos
    let pedidosValidos = true;
    const updatedPedidos = pedidos.map((pedido, index) => {
      // O primeiro pedido é obrigatório
      const isRequired = index === 0;
      const isEmpty = pedido.valor.length === 0;
      const hasError = (isRequired && isEmpty) || (pedido.valor && !validatePedidoLength(pedido.valor));
      
      if (hasError) {
        pedidosValidos = false;
      }
      
      return { ...pedido, hasError };
    });
    
    setPedidos(updatedPedidos);
    
    return !codigoInvalido && pedidosValidos;
  };

  const resetForm = () => {
    setCodigoSeparador('');
    setCodigoSeparadorError(false);
    setPedidos([{ id: 1, valor: '', hasError: false }]);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      let errorMessage = '';
      
      if (!codigoSeparador) {
        errorMessage += '• Código do Separador é obrigatório\n';
      } else if (!validateCodigoSeparadorLength(codigoSeparador)) {
        errorMessage += '• Código do Separador deve ter exatamente 6 dígitos\n';
      }
      
      // Verificar erros nos pedidos
      pedidos.forEach((pedido, index) => {
        const pedidoNum = index + 1;
        if (index === 0 && pedido.valor.length === 0) {
          errorMessage += `• Pedido 01 é obrigatório\n`;
        }
        if (pedido.valor && !validatePedidoLength(pedido.valor)) {
          errorMessage += `• Pedido ${String(pedidoNum).padStart(2, '0')} deve ter exatamente 7 dígitos\n`;
        }
      });

      Alert.alert(
        'Erros no formulário',
        errorMessage,
        [{ text: 'OK' }]
      );
      return;
    }

    // Criar objeto para envio com os dados
    const formData = {
      codigoSeparador,
      pedidos: pedidos.map(p => p.valor).filter(v => v !== '')
    };

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
            codigoSeparadorError && styles.inputError
          ]}>
            <MaterialIcons name="person-pin" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={codigoSeparador}
              onChangeText={handleCodigoSeparadorChange}
              placeholder="Digite o código do separador (6 dígitos)"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          {codigoSeparadorError && (
            <Text style={styles.errorText}>
              {codigoSeparador.length === 0 
                ? 'Este campo é obrigatório' 
                : 'O código deve ter exatamente 6 dígitos'}
            </Text>
          )}
        </View>

        {/* Campos de Pedido Dinâmicos */}
        {pedidos.map((pedido, index) => (
          <View key={pedido.id} style={styles.formGroup}>
            <View style={styles.pedidoLabelContainer}>
              <Text style={styles.label}>
                Pedido {String(index + 1).padStart(2, '0')} {index === 0 ? '*' : ''}
              </Text>
              {index > 0 && (
                
                <TouchableOpacity 
                  onPress={() => removerPedido(pedido.id)}
                  style={styles.removerPedidoButton}
                >
                  <MaterialIcons name="remove-circle" size={25} color="#F44336" />
                </TouchableOpacity>

              )}
            </View>
            <View style={[
              styles.inputContainer, 
              pedido.hasError && styles.inputError
            ]}>
              <MaterialIcons name="shopping-cart" size={20} color="#4CAF50" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={pedido.valor}
                onChangeText={(text) => handlePedidoChange(pedido.id, text)}
                placeholder="Bipe o número do pedido (7 dígitos)"
                placeholderTextColor="#9E9E9E"
                keyboardType="numeric"
                maxLength={7}
              />
            </View>
            {pedido.hasError && (
              <Text style={styles.errorText}>
                {index === 0 && pedido.valor.length === 0
                  ? 'Este campo é obrigatório'
                  : 'O pedido deve ter exatamente 7 dígitos'}
              </Text>
            )}
          </View>
        ))}

        {/* Botão para adicionar novo pedido - desaparece ao atingir 5 pedidos */}
        {pedidos.length < 5 && (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={adicionarPedido}
          >
            <MaterialIcons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.addButtonText}>Adicionar Pedido</Text>
          </TouchableOpacity>
        )}
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
  pedidoLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: '600',
  },
  removerPedidoButton: {
    padding: 4,
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