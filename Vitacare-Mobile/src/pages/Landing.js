import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function Landing({ navigation }) {
  // const navigation = useNavigation();

  //estados para modal consulta
  const [selectedDate, setSelectedDate] = useState("");
  const [consulta, setConsulta] = useState("");
  const [dbProvider, setDbProvider] = useState("supabase"); // ou "postgres"
  const [remedios, setRemedios] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  // Dados do Usuario
  const [usuario, setUsuario] = useState("");
  const [id_usuario, setIdUsuario] = useState("");

  // configurações para o input com calendario
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  //estados para editar o remedio
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [remedioSelecionado, setRemedioSelecionado] = useState(null);

  const onChange = (event, selectedDate) => {
    setMostrarPicker(false);
    if (selectedDate) {
      setDataSelecionada(selectedDate);
      const dataFormatada = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      setdata_inicio(dataFormatada);
    }
  };

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);
          setUsuario(usuario.nome);
          console.log(usuario);

          setIdUsuario(usuario.id_usuario); // ou o nome correto da chave retornada
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };

    carregarUsuario();
  }, []);

  const dias = [
    { dia: "Seg", num: "25" },
    { dia: "Ter", num: "26" },
    { dia: "Qua", num: "27" },
    { dia: "Qui", num: "28" },
    { dia: "Sex", num: "29" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          {/* Header da Header */}
          <View
            style={{
              flexDirection: "row",
              gap: 15,
              padding: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{display: "flex", flexDirection: "row", gap: 15, alignItems: "center"}}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{
                    uri: "https://i.pinimg.com/736x/61/8f/b1/618fb1a8cf308ceea61c5d1545e5fd7a.jpg",
                  }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                  resizeMode="cover"
                />
              </View>

              <View>
                <Text style={styles.bomdia}>Bom dia,</Text>
                <Text style={styles.usuario}>{usuario}</Text>
              </View>
            </View>
            
            {/* Notificação */}
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                padding: 4,
                borderRadius: 10,
                alignSelf: "flex-start",
                borderBottomColor: "black",
                
              }}
            >
              <Ionicons name="notifications-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <View>
            {/* Pergunta */}
            <Text style={styles.pergunta}>
              Como você está se sentindo hoje?
            </Text>

            {/* Botões de opções */}
            <View style={styles.opcoes}>
              <TouchableOpacity style={styles.opcaoBtn}>
                <Text> <FontAwesome5 name="clipboard-check" size={24} color="black" /> Checkup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opcaoBtn}>
                <Text> <MaterialIcons name="health-and-safety" size={24} color="black" /> Remédios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opcaoBtn}>
                <Text>IA</Text>
              </TouchableOpacity>
            </View>
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
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#f4f4f4",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 20,
  },
  bomdia: { fontSize: 16, color: "#000" },
  usuario: { fontSize: 18, fontWeight: "bold", color: "#000" },
  pergunta: {
    fontSize: 20,
    fontWeight: "medium",
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
    alignItems: "center"
  },
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
  remediosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
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
    padding: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  cardSub: { fontSize: 12, textAlign: "center", color: "#555" },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuItem: { alignItems: "center" },
  menuItemAtivo: {
    backgroundColor: "#2683ff",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  menuAtivoText: { color: "white", fontSize: 12, marginTop: 2 },
});
