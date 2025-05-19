import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StatusBar, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Componente principal da tela inicial do aplicativo
export default function SeparaçaodeCarrinhos({ navigation }) {
  
  // Função para abrir formulário externo do Google
  const handleOpenForm = () => {
    Linking.openURL('https://forms.gle/gC6cSvuYmwMBm1eW8');
  };

  // Função para abrir página de analytics (simulada com deepseek.com)
  const handleOpenAnalytics = () => {
    Linking.openURL('https://www.deepseek.com'); // URL deveria ser substituída pelo real link de analytics
  };

  return (
    <View style={styles.container}>
      {/* Configuração da barra de status (topo do celular) */}
      <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />
      
      {/* Cabeçalho da página */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Controle de Operações Logísticas</Text>
      </View>

      {/* Container principal dos cards de ação */}
      <View style={styles.cardsContainer}>
        
        
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}




        
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}




        

        {/* Card 3: Separação de Carrinhos (link externo) */}
        <TouchableOpacity
          style={styles.card}
          onPress={handleOpenForm}
          accessibilityLabel="Acessar formulário de separação de carrinhos"
        >
          <View style={styles.iconContainer}>
            {/* Ícone de formulário/descrição */}
            <MaterialIcons name="description" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Separação de carrinhos(Entrega)</Text>
            <Text style={styles.cardSubtext}>Acessar formulário google</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
        </TouchableOpacity>

        {/* Card 4: Fluxo da Sala Nobre (novo) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('FluxoSalaNobre')}
          accessibilityLabel="Registrar fluxo da sala nobre"
        >
          <View style={styles.iconContainer}>
            {/* Ícone de fluxo (setas verticais) */}
            <MaterialIcons name="swap-vert" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardText}>Fluxo da sala nobre</Text>
            <Text style={styles.cardSubtext}>Registrar código da caixa</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#E8F5E9" />
        </TouchableOpacity>
      </View>

      {/* Botão fixo de Analytics no canto inferior esquerdo */}
      <TouchableOpacity 
        style={styles.analyticsButton} 
        onPress={handleOpenAnalytics}
        accessibilityLabel="Acessar página de analytics"
      >
        <MaterialIcons name="analytics" size={24} color="#FFFFFF" style={styles.analyticsIcon} />
        <Text style={styles.analyticsButtonText}>WEB PAGE ANALYTICS</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos da página usando StyleSheet.create
const styles = StyleSheet.create({
  // Estilo do container principal
  container: {
    flex: 1, // Ocupa toda a tela
    backgroundColor: '#F5F5F5', // Cor de fundo cinza claro
    paddingTop: 48, // Espaçamento superior
    paddingHorizontal: 24, // Espaçamento horizontal
  },
  
  // Estilo do container do cabeçalho
  headerContainer: {
    alignItems: 'center', // Centraliza horizontalmente
    marginBottom: 40, // Espaçamento inferior
  },
  
  // Estilo do título do cabeçalho
  headerTitle: {
    fontSize: 28, // Tamanho grande para título
    fontWeight: '700', // Negrito
    color: '#2E7D32', // Cor verde escuro
    textAlign: 'center', // Texto centralizado
  },
  
  // Estilo do container dos cards
  cardsContainer: {
    width: '100%', // Largura total
    flex: 1, // Ocupa todo espaço disponível
    marginBottom: 70, // Espaço para o botão fixo inferior
  },
  
  // Estilo base dos cards
  card: {
    flexDirection: 'row', // Itens alinhados em linha
    alignItems: 'center', // Centralizados verticalmente
    backgroundColor: '#FFFFFF', // Fundo branco
    paddingVertical: 16, // Espaçamento vertical
    paddingHorizontal: 20, // Espaçamento horizontal
    borderRadius: 12, // Bordas arredondadas
    width: '100%', // Largura total
    marginBottom: 20, // Espaçamento entre cards
    elevation: 2, // Sombra no Android
    shadowColor: '#1B5E2040', // Cor da sombra (iOS)
    shadowOpacity: 0.1, // Opacidade da sombra (iOS)
    shadowRadius: 6, // Raio da sombra (iOS)
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra (iOS)
    borderLeftWidth: 4, // Borda esquerda destacada
    borderLeftColor: '#4CAF50', // Cor verde da borda esquerda
  },
  
  // Estilo do container de ícones
  iconContainer: {
    backgroundColor: '#4CAF50', // Fundo verde
    width: 48, // Largura fixa
    height: 48, // Altura fixa
    borderRadius: 24, // Circular (metade da largura/altura)
    justifyContent: 'center', // Centraliza ícone verticalmente
    alignItems: 'center', // Centraliza ícone horizontalmente
    marginRight: 16, // Espaçamento à direita
  },
  
  // Container do texto dentro do card
  textContainer: {
    flex: 1, // Ocupa todo espaço disponível
  },
  
  // Estilo do texto principal do card
  cardText: {
    fontSize: 16, // Tamanho médio
    color: '#212121', // Cor quase preta
    fontWeight: '600', // Semi-negrito
  },
  
  // Estilo do subtítulo do card
  cardSubtext: {
    fontSize: 14, // Tamanho pequeno
    color: '#757575', // Cor cinza
    marginTop: 4, // Espaçamento superior pequeno
  },
  
  // Estilo do botão fixo de analytics
  analyticsButton: {
    position: 'absolute', // Posicionamento absoluto
    left: 24, // Distância da esquerda
    bottom: 24, // Distância de baixo
    backgroundColor: '#4CAF50', // Cor verde igual aos ícones
    paddingVertical: 12, // Espaçamento vertical
    paddingHorizontal: 16, // Espaçamento horizontal
    borderRadius: 8, // Bordas arredondadas
    flexDirection: 'row', // Ícone e texto em linha
    alignItems: 'center', // Centralizados verticalmente
    elevation: 3, // Sombra no Android
    shadowColor: '#1B5E20', // Cor da sombra (iOS)
    shadowOffset: { width: 0, height: 2 }, // Deslocamento (iOS)
    shadowOpacity: 0.3, // Opacidade (iOS)
    shadowRadius: 3, // Raio (iOS)
  },
  
  // Estilo do texto do botão de analytics
  analyticsButtonText: {
    color: '#FFFFFF', // Texto branco
    fontWeight: '600', // Semi-negrito
    fontSize: 17, // Tamanho do texto
    marginLeft: 8, // Espaçamento à esquerda do ícone
  },
  
  // Estilo do ícone do botão de analytics
  analyticsIcon: {
    marginRight: 1, // Pequeno ajuste de espaçamento
  },
});