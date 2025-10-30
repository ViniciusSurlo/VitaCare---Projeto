import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { enderecoServidor } from "../utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

// Componente Card de Consulta
const ConsultaCard = ({ consulta }) => {
  // Função auxiliar para formatar a data
  const formatarData = (data) => {
    if (!data) return "Data não informada";
    try {
      // Supondo que a data venha no formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
      const dataObj = new Date(data);
      if (isNaN(dataObj)) return "Data inválida";
      
      const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return `${dataFormatada}`;
    } catch (e) {
      return "Erro ao formatar data";
    }
  };

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.iconContainer}>
        <FontAwesome5 name="stethoscope" size={24} color="#0049AB" />
      </View>
      <View style={cardStyles.infoContainer}>
        <Text style={cardStyles.title}>{consulta.especialidade || "Consulta Médica"}</Text>
        <Text style={cardStyles.subtitle}>
          <Ionicons name="calendar-outline" size={14} color="#555" /> {formatarData(consulta.data)}
        </Text>
        <Text style={cardStyles.subtitle}>horário: {consulta.hora}</Text>
        <Text style={cardStyles.subtitle}>
          <Ionicons name="location-outline" size={14} color="#555" /> {consulta.local || "Local não informado"}
        </Text>
      </View>
    </View>
  );
};

export default function Historico({ navigation }) {
  const [dadosLista, setDadosLista] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [id_usuario, setIdUsuario] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);
          setUsuario(usuario);
          setIdUsuario(usuario.id_usuario);
          console.log("Usuário carregado:", usuario);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (id_usuario) {
      const buscarDadosAPI = async () => {
        setCarregando(true);
        try {
          const resposta = await fetch(
            `${enderecoServidor}/historicoconsultas/usuario/${usuario.id_usuario}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${usuario.token}`,
                "Content-Type": "application/json",
              },
            }
          );
          
          // Verifica se a resposta foi bem-sucedida (status 200)
          if (resposta.ok) {
            const dados = await resposta.json();
            setDadosLista(dados);
            console.log("dados da api: ", dados);
          } else {
            const erroTexto = await resposta.text();
            setDadosLista([]); // Limpa a lista em caso de erro
          }

        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
        } finally {
          setCarregando(false);
        }
      };
      buscarDadosAPI();
    }
  }, [id_usuario, usuario.token]); // Adicionado usuario.token como dependência

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e1e1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Consultas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {carregando && (
          <ActivityIndicator size="large" color="#0049AB" style={{ marginTop: 20 }} />
        )}

        {!carregando && dadosLista.length === 0 && (
          <Text style={styles.emptyText}>Nenhum histórico de consulta encontrado.</Text>
        )}

        {/* Renderiza os Cards de Consulta */}
        {!carregando && dadosLista.length > 0 && dadosLista.map((consulta, index) => (
          <ConsultaCard key={index} consulta={consulta} />
        ))}
      </ScrollView>
    </View>
  );
}

// Estilos da Tela Principal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8", // Fundo suave
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginLeft: 15,
  },
  scrollContent: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#555',
  }
});

// Estilos para o Card de Consulta
const cardStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 15,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#E6F0FF', // Cor de fundo para o ícone
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e1e1e',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
});