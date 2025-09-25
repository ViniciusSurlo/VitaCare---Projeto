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
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Landing({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [id_usuario, setIdUsuario] = useState("");

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
            <View style={styles.headerUser}>
              <Image
                source={{
                  uri: "https://i.pinimg.com/736x/61/8f/b1/618fb1a8cf308ceea61c5d1545e5fd7a.jpg",
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.bomdia}>Bom dia,</Text>
                <Text style={styles.usuario}>{usuario}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.notificacao}>
              <Ionicons name="notifications-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.pergunta}>Como você está se sentindo hoje?</Text>

          <View style={styles.opcoes}>
            <TouchableOpacity style={styles.opcaoBtn}>
              <Text>
                <FontAwesome5 name="clipboard-check" size={20} color="black" />{" "}
                Checkup
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcaoBtn}>
              <Text>
                <MaterialIcons name="health-and-safety" size={20} color="black" />{" "}
                Remédios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcaoBtn}>
              <Text>
                <MaterialCommunityIcons name="robot" size={20} color="black" /> IA
              </Text>
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
              <Text>{d.dia}</Text>
              <Text>{d.num}</Text>
            </View>
          ))}
        </View>

        {/* Cards de Menu */}
        <View style={styles.cards}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Medicamentos")}>
            <FontAwesome5 name="pills" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Remédios</Text>
            <Text style={styles.cardSub}>Veja aqui seus medicamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <MaterialCommunityIcons name="robot" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>IACare</Text>
            <Text style={styles.cardSub}>Converse com a IA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Entypo name="folder" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Sei lá oq</Text>
            <Text style={styles.cardSub}>Veja aqui seus sei lá o ques</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Consultas")}>
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
    gap: 15,
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
    padding: 4,
    borderRadius: 10,
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
    gap: 10,
    paddingHorizontal: 20,
  },
  opcaoBtn: {
    backgroundColor: "#ECECEC",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderColor: "#fff",
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
  },

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
    width: 50,
  },
  diaSelecionado: {
    borderColor: "black",
  },

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
