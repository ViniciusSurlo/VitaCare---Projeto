import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
// import { Calendar } from "react-native-calendars"; // Importando o calendário, se necessário
// import { supabase } from "../../lib/supabaseClient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { enderecoServidor } from "../utils";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

export default function Landing() {
  const navigation = useNavigation();

  //estados para modal consulta
  const [selectedDate, setSelectedDate] = useState("");
  const [consulta, setConsulta] = useState("");
  const [dbProvider, setDbProvider] = useState("supabase"); // ou "postgres"
  const [remedios, setRemedios] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  // Dados do Usuario
  const [usuario, setUsuario] = useState("");
  const [id_usuario, setIdUsuario] = useState("")

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

  //para carregar os dados do usuario logado
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


  // Função para abrir o modal de edição
  const abrirModalEditar = (remedio) => {
    setRemedioSelecionado(remedio);
    setModalEditarVisible(true);
  };

  // Função para salvar as alterações
  const salvarEdicao = async () => {
    if (remedioSelecionado) {
      await editarRemedio(remedioSelecionado.id_medicamento);
      setModalEditarVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: "80%" }}>
          {/* <View style={styles.headerCinza}> Fiz essa header para fazer a parte cinza que temos no Figma (faltou voce fechar a view la embaixo) */}
          <Image source={require("../assets/logo1.png")} style={styles.logo} />
          <Text style={styles.headerText}>
            Olá, <Text style={{ fontStyle: "italic" }}>{usuario}!</Text>{" "}
          </Text>
          <Text style={styles.headerSubText}>
            Vamos cuidar da sua
            <Text style={{ color: "#004AAD", fontWeight: 500 }}>
              {" "}
              saúde?{" "}
            </Text>{" "}
          </Text>
        </View>
        <View style={{ width: "20%", display: "flex" }}>
          <LinearGradient
            colors={["#FAF4F4", "#DEE4F4"]}
            style={styles.linearGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 1, y: 0.5 }}
          >
            <Ionicons name="notifications" size={24} color="black" />
          </LinearGradient>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      ></View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultas</Text>
        <View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Consultas")}
          >
            <Text style={styles.addButtonText}>Adicione a consulta</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remédios de Hoje</Text>
        {remedios.length > 0 ? (
          remedios
            .filter((remedio) => {
              const hoje = new Date().toISOString().split("T")[0];
              return (
                remedio.ativo &&
                remedio.data_inicio <= hoje &&
                remedio.data_fim >= hoje
              );
            })
            .map((remedio) => (
              <View key={remedio.id_medicamento} style={styles.card}>
                <Text style={styles.cardTitle}>{remedio.nome}</Text>
                <Text style={styles.cardSubtitle}>
                  Dosagem: {remedio.dosagem}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Frequência: {remedio.frequencia}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Horários: {remedio.horarios}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Observações: {remedio.observacoes}
                </Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={() => abrirModalEditar(remedio)}
                  >
                    <Text style={styles.cardButtonText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
        ) : (
          <Text style={styles.noDataText}>Nenhum remédio para hoje.</Text>
        )}
      </View>
      {/* </View> */}
    
      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditarVisible}
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Remédio</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do remédio"
              placeholderTextColor="#aaa"
              value={remedioSelecionado?.nome || ""}
              onChangeText={(text) =>
                setRemedioSelecionado({ ...remedioSelecionado, nome: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Dosagem"
              placeholderTextColor="#aaa"
              value={remedioSelecionado?.dosagem || ""}
              onChangeText={(text) =>
                setRemedioSelecionado({ ...remedioSelecionado, dosagem: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Frequência"
              placeholderTextColor="#aaa"
              value={remedioSelecionado?.frequencia || ""}
              onChangeText={(text) =>
                setRemedioSelecionado({
                  ...remedioSelecionado,
                  frequencia: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Horários"
              placeholderTextColor="#aaa"
              value={remedioSelecionado?.horarios || ""}
              onChangeText={(text) =>
                setRemedioSelecionado({ ...remedioSelecionado, horarios: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Data de início (YYYY-MM-DD)"
              placeholderTextColor="#aaa"
              value={remedioSelecionado?.data_inicio || ""}
              onChangeText={(text) =>
                setRemedioSelecionado({
                  ...remedioSelecionado,
                  data_inicio: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Data de fim (YYYY-MM-DD)"
              placeholderTextColor="#aaa"
              value={remedioSelecionado?.data_fim || ""}
              onChangeText={(text) =>
                setRemedioSelecionado({ ...remedioSelecionado, data_fim: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Observações"
              placeholderTextColor="#aaa"
              value={remedioSelecionado?.observacoes || ""}
              onChangeText={(text) =>
                setRemedioSelecionado({
                  ...remedioSelecionado,
                  observacoes: text,
                })
              }
            />
            <TouchableOpacity style={styles.saveButton} onPress={salvarEdicao}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalEditarVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* cards para acessar os remedios, consultas, sla oq e balblabla */}
      <View className="mt-6 mb-6 p-4">
        <View className="flex-row justify-between mb-4">
          {/* Card Remédios */}
          <TouchableOpacity
            className="bg-gray-100 rounded-xl w-[48%] h-48 items-center justify-start"
            onPress={() => navigation.navigate("Medicamentos")}
          >
            
            <Text className="text-lg font-bold mt-2">Remédios</Text>
            <Text className="text-gray-500 text-center text-xs mt-1 px-2">
              Veja aqui seus medicamentos
            </Text>
            <Ionicons
              name="medkit"
              size={55}
              color="#2683ff"
              style={{ marginTop: 12 }}
            />
          </TouchableOpacity>

          {/* Card Blablabla */}
          <TouchableOpacity
            className="bg-gray-100 rounded-xl w-[48%] h-48 items-center justify-start"
            onPress={() => {
              /* ação blablabla */
            }}
          >
            
            <Text className="text-lg font-bold mt-2">Blablabla</Text>
            <Text className="text-gray-500 text-center text-xs mt-1 px-2">
              Veja aqui seus blablablas
            </Text>
            <MaterialCommunityIcons
              name="chat"
              size={55}
              color="#2683ff"
              style={{ marginTop: 12 }}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between">
          {/* Card Sei la Oq */}
          <TouchableOpacity
            className="bg-gray-100 rounded-xl w-[48%] h-48 items-center justify-start"
            onPress={() => {
              /* ação sei la oq */
            }}
          >
            
            <Text className="text-lg font-bold mt-2">Sei la Oq</Text>
            <Text className="text-gray-500 text-center text-xs mt-1 px-2">
              Veja aqui seus sei la o ques
            </Text>
            <Entypo
              name="help"
              size={55}
              color="#2683ff"
              style={{ marginTop: 12 }}
            />
          </TouchableOpacity>

          {/* Card Consultas */}
          <TouchableOpacity
            className="bg-gray-100 rounded-xl w-[48%] h-48 items-center justify-start"
            onPress={() => navigation.navigate("Consultas")}
          >
            
            <Text className="text-lg font-bold mt-2">Consultas</Text>
            <Text className="text-gray-500 text-center text-xs mt-1 px-2">
              Veja aqui suas consultas
            </Text>
            <Ionicons
              name="calendar"
              size={55}
              color="#2683ff"
              style={{ marginTop: 12 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para adicionar consulta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Consulta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da consulta"
              placeholderTextColor="#aaa"
              value={consulta}
              onChangeText={setConsulta}
            />
            <Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Data da consulta (YYYY-MM-DD)"
              placeholderTextColor="#aaa"
              value={selectedDate}
              onChangeText={(text) => setSelectedDate(text)}
            />
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              // onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 20,
  },
  cardActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,
  },
  cardButton: {
    backgroundColor: "#2683ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    flexDirection: "row",
    margin: 10
  },
  // headerCinza: {
  //   backgroundColor: "#e4e4e5",
  //   borderRadius: 25,
  //   height: 100,
  //   width: 100%
  // },
  headerText: {
    fontSize: 24,
    fontWeight: 400,
    color: "#000000",
  },
  headerSubText: {
    fontSize: 18,
    fontWeight: 400,
    color: "#000000",
  },
  addButton: {
    backgroundColor: "#2683ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
  },
  calendar: {
    marginTop: 15,
    backgroundColor: "#004AAD",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarText: {
    color: "#64748b",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  logo: {
    width: "60%",
    height: "60%",
    marginLeft: -10,
  },
  selectedDateText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#e2e8f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    color: "#1e293b",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#418cd3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#1e293b",
    fontWeight: "bold",
  },
  linearGradient: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "center",
    justifyContent: "center",
    marginTop: "20%",
  },
  noDataText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 10,
  },
});
