import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Landing({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const [medicamentos, setMedicamentos] = useState({})
  const [consultas, setConsultas] = useState({})

  //variaveis de estado para analise com IA
  const [analise, setAnalise] = useState("");
  const [carregandoAnalise, setCarregandoAnalise] = useState(null);
  const [erroAnalise, setErroAnalise] = useState(null);
  const [modalAnaliseAberto, setModalAnaliseAberto] = useState(false);

  //fetch para os remedios da IA

  //fetch para as consultas da IA

   //função do modal de analise com IA
  const ModalAnalise = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Análise com IA
          </h2>
          <button
            onClick={() => setModalAnaliseAberto(false)}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
            &times;
          </button>
        </div>
        <div className="min-h-[200px]">
          {carregandoAnalise && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Analisando seus dados...</p>
            </div>
          )}
          {erroAnalise && (
            <p className="text-red-700 bg-red-50 p-4 rounded-lg">
              {erroAnalise}
            </p>
          )}
          {analise && (
            <div className="prose max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
              {analise}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => setModalAnaliseAberto(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  //função para chamar API da OPENAI 
  const analiseComIA = async () => {
    setCarregandoAnalise(true);
    setErroAnalise(null)
    setAnalise('')
    setModalAnaliseAberto(true)

    try {
      // criando o prompt de comando pra enviar por bichin
      const prompt = `Você é um consultor pessoal de remédios`;

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
            message: [{role: 'user', content: prompt}],
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
          setUsuario(usuario.nome);
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
                <Text style={styles.usuario}>{usuario}.</Text>
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

            <TouchableOpacity style={styles.opcaoBtn} onClick={analiseComIA}>
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
