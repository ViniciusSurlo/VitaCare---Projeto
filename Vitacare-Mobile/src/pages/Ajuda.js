import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dados de Ajuda (Perguntas e Respostas)
const helpTopics = [
  {
    id: 1,
    question: 'Como Vejo Meus Remédios e Horários?',
    answer: 'Na tela principal (Home), toque no ícone de remédios (pílula) na parte de baixo. Lá você verá a lista de todos os seus medicamentos e os horários que precisa tomar. Se precisar adicionar um novo, procure o botão de "+".',
  },
  {
    id: 2,
    question: 'Como Marcar ou Ver Minhas Consultas?',
    answer: 'Toque no ícone de calendário na parte de baixo da tela. Você verá as consultas futuras. Para agendar uma nova, use o botão de agendamento na parte superior da tela de Consultas.',
  },
  {
    id: 3,
    question: 'O que é a "IA" (Inteligência Artificial)?',
    answer: 'A IA é um assistente automático que analisa seus dados de remédios e consultas para lhe dar dicas de saúde e organização. Ela não substitui o seu médico, mas é um bom lembrete!',
  },
  {
    id: 4,
    question: 'Como Mudar Minhas Informações Pessoais?',
    answer: 'Vá para a tela de Configurações (onde você está agora) e toque em "Meu Perfil". Lá você pode mudar seu nome, telefone e outras informações importantes.',
  },
  {
    id: 5,
    question: 'O que Fazer em Caso de Emergência?',
    answer: 'ESTE APLICATIVO NÃO É PARA EMERGÊNCIAS. Se você estiver passando mal ou precisar de ajuda urgente, ligue imediatamente para o número de emergência (ex: 192 ou 190).',
  },
];

// Componente de Item Expansível (Acordeão)
const HelpItem = ({ topic }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.questionButton}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
      >
        <Text style={styles.questionText}>{topic.question}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={24}
          color="#0049AB"
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{topic.answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function HelpScreen({ navigation }) {
  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#1e1e1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Central de Ajuda</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Encontre respostas rápidas para as dúvidas mais comuns sobre o uso do aplicativo.
        </Text>
        
        {helpTopics.map((topic) => (
          <HelpItem key={topic.id} topic={topic} />
        ))}
        
        <Text style={styles.contactText}>
          Se não encontrou sua resposta, entre em contato com o suporte.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24, // Fonte grande para fácil leitura
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  questionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  questionText: {
    fontSize: 18, // Fonte grande
    fontWeight: '600',
    color: '#0049AB',
    flexShrink: 1,
    marginRight: 10,
  },
  answerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answerText: {
    fontSize: 16, // Fonte legível
    color: '#333',
    lineHeight: 24,
  },
  contactText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  }
});