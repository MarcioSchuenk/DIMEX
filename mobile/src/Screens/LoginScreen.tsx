import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../providers/AuthContext';
import { API_URL } from '@env';
import { InputField } from '../components/InputField';
import { AuthButton } from '../components/AuthButton';
import { Card } from '../components/CardFluxoSalaNobre';
export const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      console.log('Enviando login para:', `${API_URL}/users/login`);
      const response = await axios.post(`${API_URL}/users/login`, {
        login: username,
        password: password,
      });

      const { accessToken, user } = response.data;

      const userData = {
        id: user.id,
        name: user.login,
        role: user.role,
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao fazer login'
      );
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Controle Logístico</Text>
          </View>

          <Card>
            <Text style={styles.header}>Login</Text>

            <InputField
              label="Usuário"
              icon="person"
              value={username}
              onChangeText={setUsername}
              placeholder="Digite seu usuário"
            />

            <InputField
              label="Senha"
              icon="lock"
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <AuthButton
              onPress={handleLogin}
              label="ENTRAR"
              icon="login"
            />
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  logoImage: {
    width: 320,
    height: 240,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 24,
    textAlign: 'center',
  },
});