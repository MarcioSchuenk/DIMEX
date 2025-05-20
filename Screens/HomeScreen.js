import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StatusBar, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente principal da tela de Separação de Carrinhos
 * Exibe cards de ações para diferentes operações logísticas
 * 
 * @param {object} navigation - Objeto de navegação do React Navigation
 * @returns {JSX.Element} Componente da tela
 */
export default function SeparaçaodeCarrinhos({ navigation }) {
  
  /**
   * Abre o formulário externo do Google Forms em um navegador
   */
  const handleOpenForm = () => {
    Linking.openURL('https://forms.gle/gC6cSvuYmwMBm1eW8');
  };

  /**
   * Abre a página de analytics (simulação com deepseek.com)
   * Substituir pela URL real de analytics quando disponível
   */
  const handleOpenAnalytics = () => {
    Linking.openURL('https://www.deepseek.com');
  };

  return (
    <View style={styles.container}>
      {/* Barra de status com fundo claro e ícones escuros */}
      <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />
      
      {/* Cabeçalho da aplicação */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Controle de Operações Logísticas</Text>
      </View>

      {/* Container principal com os cards de ação */}
      <View style={styles.cardsContainer}>


        
        {/* Card 1: Sobras de Carregamento */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SobrasCarregamento')}
          accessibilityLabel="Registrar sobras de carregamento"
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="local-shipping" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Sobras de Carregamento</Text>
            <Text style={styles.cardSubtext}>Registrar no app</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
        </TouchableOpacity>



        {/* Card 2: Sobras da Sala Nobre */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SobrasSalaNobre')}
          accessibilityLabel="Registrar sobras da sala nobre"
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="meeting-room" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Sobras da Sala Nobre</Text>
            <Text style={styles.cardSubtext}>Registrar no app</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
        </TouchableOpacity>



        {/* Card 3: Fluxo da Sala Nobre */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('FluxoSalaNobre')}
          accessibilityLabel="Registrar fluxo da sala nobre"
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="swap-vert" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Fluxo da sala nobre</Text>
            <Text style={styles.cardSubtext}>Registrar código da caixa</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
        </TouchableOpacity>



        {/* Card 4: Separação de Carrinhos (Formulário Externo) */}
        <TouchableOpacity
          style={styles.card}
          onPress={handleOpenForm}
          accessibilityLabel="Acessar formulário de separação de carrinhos"
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="shopping-cart" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Separação de carrinhos(FormGoogle)</Text>
            <Text style={styles.cardSubtext}>Acessar formulário google</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
        </TouchableOpacity>



        {/* Card 5: Separação de Carrinhos (Nativo) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SeparacaoCarrinhos')}
          accessibilityLabel="Registrar separação de carrinhos"
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="shopping-cart" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Separação de carrinhos (nativo)</Text>
            <Text style={styles.cardSubtext}>Registros de separação</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
        </TouchableOpacity>
      </View>

      {/* Botão Fixo de Analytics */}
      <TouchableOpacity 
        style={styles.analyticsButton} 
        onPress={handleOpenAnalytics}
        accessibilityLabel="Acessar página de analytics"
      >
        <MaterialIcons name="analytics" size={24} color="#FFFFFF" />
        <Text style={styles.analyticsButtonText}>WEB PAGE ANALYTICS</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Folha de estilos utilizando StyleSheet.create
 * Organizada por componentes e mantendo consistência visual
 */
const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  
  // Cabeçalho
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'center',
  },
  
  // Container dos cards
  cardsContainer: {
    width: '100%',
    flex: 1,
    marginBottom: 70,
  },
  
  // Estilo base do card
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
  
  // Container do ícone circular
  iconContainer: {
    backgroundColor: '#4CAF50',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  // Container do texto
  textContainer: {
    flex: 1,
  },
  
  // Texto principal do card
  cardText: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '600',
  },
  
  // Subtítulo do card
  cardSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  
  // Botão fixo de analytics
  analyticsButton: {
    position: 'absolute',
    left: 24,
    bottom: 24,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  // Texto do botão de analytics
  analyticsButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
    marginLeft: 8,
  },
});