import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { enderecoServidor } from "../utils";

export default function Landing({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const [dadosDashboard, setDadosDashboard] = useState({
    medicamentos: [],
    consultas: [],
  });

  //variaveis de estado para analise com IA
  const [analise, setAnalise] = useState("");
  const [carregandoAnalise, setCarregandoAnalise] = useState(null);
  const [erroAnalise, setErroAnalise] = useState(null);
  const [modalAnaliseAberto, setModalAnaliseAberto] = useState(false);

  //FETCH PRA BUSCAR DADOS PRA IA
  //NÃO TA PASSANDO OS DADOS DE REMEDIOS E CONSULTAS
  const buscarDadosIA = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/medicamentos/buscarDados/${id_usuario}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      })
        const dados = await resposta.json();
        setDadosDashboard(dados);
        console.log("Dados recebidos:", dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);     
    }
  }

  //função do modal de analise com IA
  // FALTA ESTILIZAR
  const ModalAnalise = () => (
    <View >
      <View>
        <View>
          <Text>
            Análise Financeira com IA
          </Text>
          <TouchableOpacity
            onPress={() => setModalAnaliseAberto(false)}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
          </TouchableOpacity>
        </View>
        <View>
          {carregandoAnalise && (
            <View >
              <View></View>
              <Text>Analisando suas finanças...</Text>
            </View>
          )}
          {erroAnalise && (
            <Text>
              {erroAnalise}
            </Text>
          )}
          {analise && (
            <View>
              {analise}
            </View>
          )}
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setModalAnaliseAberto(false)}
          >
            Fechar
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  //função para chamar API da OPENAI 
  const analiseComIA = async () => {
    setCarregandoAnalise(true);
    setErroAnalise(null)
    setAnalise('')
    setModalAnaliseAberto(true)

    try {
      buscarDadosIA();
      // criando o prompt de comando pra enviar por bichin
      const prompt = `
        Você é um consultor pessoal de saúde, especializado em orientar pacientes sobre o uso de medicamentos e consultas médicas.

        Receberá dois conjuntos de dados em formato JSON: 
        1. **Medicamentos** – contendo nome, horário, dose e observações.
        2. **Consultas** – contendo especialidade, data, hora e local.

        Com base nessas informações, gere uma análise resumida e útil, com no máximo **200 palavras**, abordando:
        - Pontos de atenção (interações, horários próximos, possíveis esquecimentos).
        - Sugestões de rotina saudável para organizar remédios e consultas.
        - Lembretes práticos (ex: “levar o remédio X antes da consulta Y”).
        - Um breve incentivo motivacional no final.

        Evite termos técnicos complexos. Seja claro, empático e direto.

        Abaixo estão os dados do usuário:
        Medicamentos: ${JSON.stringify(dadosDashboard.medicamentos)}
        Consultas: ${JSON.stringify(dadosDashboard.consultas)}

        Agora, gere o texto da análise.
      `

      //API key - é a chave secreta da OPENAI
      const apikey = '';

      const resposta = await fetch(
        `https://api.openai.com/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 300,
            temperature: 0.7,
          })
        }
      );
      const dados = await resposta.json();
      setAnalise(dados.choices[0].message.content);
      console.log("Dados ia:", dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    } finally {
      setCarregandoAnalise(false)
    }
  }

  const dias = [
    { dia: "Seg", num: "25" },
    { dia: "Ter", num: "26" },
    { dia: "Qua", num: "27" },
    { dia: "Qui", num: "28" },
    { dia: "Sex", num: "29" },
  ];

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);
          setUsuario(usuario);
          setIdUsuario(usuario.id_usuario);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };

    carregarUsuario();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.headerUser}
              onPress={() => navigation.navigate("Perfil")}
            >
              <Image
                source={{
                  uri: "https://i.pinimg.com/736x/61/8f/b1/618fb1a8cf308ceea61c5d1545e5fd7a.jpg",
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.bomdia}>Bom dia,</Text>
                <Text style={styles.usuario}>{usuario.nome}.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notificacao}>
              <Ionicons name="notifications-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.pergunta}>Como você está se sentindo hoje?</Text>

          <View style={styles.opcoes}>
            <TouchableOpacity style={styles.opcaoBtn}>
              <FontAwesome5 name="clipboard-check" size={18} color="#0049AB" />
              <Text style={styles.opcaoTxt}>Checkup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcaoBtn}>
              <MaterialIcons name="health-and-safety" size={18} color="#0049AB" />
              <Text style={styles.opcaoTxt}>Remédios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcaoBtn} onPress={analiseComIA}>
              <MaterialCommunityIcons name="robot" size={18} color="#0049AB" />
              <Text style={styles.opcaoTxt}>IA</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dias */}
        <View style={styles.dias}>
          {dias.map((d, i) => (
            <View
              key={i}
              style={[styles.diaItem, d.dia === "Qua" && styles.diaSelecionado]}
            >
              <Text style={styles.diaTxt}>{d.dia}</Text>
              <Text style={styles.diaTxt}>{d.num}</Text>
            </View>
          ))}
        </View>

        {/* Cards de Menu */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Medicamentos")}
          >
            <FontAwesome5 name="pills" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Remédios</Text>
            <Text style={styles.cardSub}>Veja aqui seus medicamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("IACare")}
          >
            <MaterialCommunityIcons name="robot" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>IACare</Text>
            <Text style={styles.cardSub}>Converse com a IA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Entypo name="folder" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Sei lá oq</Text>
            <Text style={styles.cardSub}>Veja aqui seus sei lá o ques</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Consultas")}
          >
            <MaterialIcons name="event-available" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Consultas</Text>
            <Text style={styles.cardSub}>Veja aqui suas consultas</Text>
          </TouchableOpacity>
        </View>
        {/* incluindo modal se variavel for true */}
        {
          modalAnaliseAberto == true ? <ModalAnalise /> : null
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /* HEADER */
  header: {
    backgroundColor: "#f4f4f4",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 20,
  },
  headerTop: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerUser: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  bomdia: { fontSize: 16, color: "#000" },
  usuario: { fontSize: 18, fontWeight: "bold", color: "#000" },
  notificacao: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  pergunta: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  opcoes: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    paddingHorizontal: 20,
  },
  opcaoBtn: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#ECECEC",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  opcaoTxt: { fontSize: 14, fontWeight: "500", color: "#000" },

  /* DIAS */
  dias: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  diaItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    width: 55,
  },
  diaSelecionado: {
    borderColor: "#0049AB",
    backgroundColor: "#E3F0FF",
  },
  diaTxt: { fontSize: 14, fontWeight: "500", color: "#000" },

  /* CARDS */
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
  },
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    width: "47%",
    height: 150,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10, color: "#000" },
  cardSub: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    marginTop: 4,
  },
  
});
