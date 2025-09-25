import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { enderecoServidor } from "../utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome6,
  FontAwesome5,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";

export default function Consultas({ navigation }) {
  const [dadosLista, setDadosLista] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [especialidade, setEspecialidade] = useState("");
  const [especialidadeOutro, setEspecialidadeOutro] = useState(""); // valor digitado
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [horarios, setHorarios] = useState("");
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalOutroVisible, setModalOutroVisible] = useState(false);
  const [atualizarConsultas, setAtualizarConsultas] = useState(false);
  const [id_usuario, setIdUsuario] = useState();

  useEffect(() => {
    if (usuario && usuario.token) {
      buscarDadosAPI();
    }
  }, [usuario]);

  const especialidades = [
    { nome: "Cardiologia", icon: <Ionicons name="heart-outline" size={28} color="#333" /> },
    { nome: "Pediatria", icon: <FontAwesome6 name="children" size={28} color="#333" /> },
    { nome: "Ginecologia", icon: <MaterialCommunityIcons name="gender-female" size={28} color="#333" /> },
    { nome: "Dermatologia", icon: <MaterialCommunityIcons name="face-man-outline" size={28} color="#333" /> },
    { nome: "Ortopedia", icon: <Ionicons name="walk-outline" size={28} color="#333" /> },
    { nome: "Neurologia", icon: <FontAwesome5 name="brain" size={28} color="#333" /> },
    { nome: "Cirurgia", icon: <Fontisto name="injection-syringe" size={28} color="#333" /> },
    { nome: "Geriatria", icon: <MaterialIcons name="elderly" size={28} color="#333" /> },
    { nome: "Psiquiatria", icon: <MaterialCommunityIcons name="brain" size={28} color="#333" /> },
    { nome: "Outro", icon: <Feather name="more-horizontal" size={28} color="#333" /> },
  ];

  const botaoExcluir = async (id) => {
    try {
      const resposta = await fetch(`${enderecoServidor}/consultas/${id}`, { method: "DELETE" });
      if (resposta.ok) {
        setDadosLista((prev) => prev.filter((c) => c.id_consulta !== id));
      }
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
    }
  };

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

  const buscarDadosAPI = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/consultas`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
      const dados = await resposta.json();
      setDadosLista(dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  useEffect(() => {
    buscarDadosAPI();
  }, [atualizarConsultas]);

  const adicionarConsulta = async () => {
    if (!especialidade || !data || !hora || !local) {
      Alert.alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const resposta = await fetch(`${enderecoServidor}/consultas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          especialidade,
          data,
          hora,
          local,
          observacoes,
          horarios,
          ativo: true,
        }),
      });
      if (resposta.ok) {
        setModalAddVisible(false);
        setEspecialidade("");
        setEspecialidadeOutro("");
        setData("");
        setHora("");
        setLocal("");
        setObservacoes("");
        setHorarios("");
        setAtualizarConsultas((prev) => !prev);
      } else {
        Alert.alert("Erro ao adicionar consulta");
      }
    } catch {
      Alert.alert("Erro ao adicionar consulta");
    }
  };

  const exibirItemLista = ({ item }) => (
    <View className="bg-gray-200 rounded-3xl p-4 m-2 flex-1">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full bg-blue-600 mr-2" />
        <View>
          <Text className="font-bold text-sm">{item.especialidade}</Text>
          <Text className="text-blue-600 text-xs mt-2 mb-2">
            {item.data.split("T")[0].split("-").reverse().join("/")}
          </Text>
          <Text className="text-blue-600 text-xs">{item.hora}</Text>
        </View>
      </View>
      <Text className="text-black text-xs mb-6">{item.observacoes}</Text>
      <TouchableOpacity className="bg-white px-3 py-1 rounded-full self-start flex-row items-center">
        <View className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
        <Text className="text-blue-500 text-xs">Horários</Text>
      </TouchableOpacity>
      <TouchableOpacity className="self-end mt-2" onPress={() => botaoExcluir(item.id)}>
        <Ionicons name="trash" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      {/* topo */}
      <View className="flex-row justify-between mt-2 mb-6 items-center">
        <TouchableOpacity
          className="bg-gray-200 rounded-full px-4 py-2 mb-6"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl text-black mb-4 font-bold">Consultas</Text>
        <TouchableOpacity
          className="bg-gray-200 rounded-full px-4 py-2 mb-6"
          onPress={() => setModalAddVisible(true)}
        >
          <Ionicons name="add" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* imagem */}
      <View className="flex items-center justify-center">
        <Image source={require("../assets/calendarinho.png")} style={{ height: 150, width: 150 }} />
      </View>

      <View className="items-center justify-center p-4 mt-4">
        <Text className="text-xl font-sans">Suas Consultas</Text>
      </View>

      {/* cards */}
      <FlatList
        data={dadosLista}
        renderItem={exibirItemLista}
        keyExtractor={(item, index) => String(item.id || index)}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />

      {/* Modal principal */}
      <Modal visible={modalAddVisible} animationType="slide" transparent={true} onRequestClose={() => setModalAddVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-blue-700 mb-4">Adicionar Consulta</Text>
            <Text className="text-base font-semibold mb-1">Especialidade</Text>

            {/* GRID BOTÕES */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginTop: 20, paddingHorizontal: 10 }}>
              {especialidades.map((item, index) => {
                const isSelecionado =
                  item.nome === "Outro"
                    ? especialidade === especialidadeOutro && especialidadeOutro !== ""
                    : especialidade === item.nome;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (item.nome === "Outro") {
                        setModalOutroVisible(true);
                      } else {
                        setEspecialidade(item.nome);
                        setEspecialidadeOutro(""); // limpa personalizado se escolher outra
                      }
                    }}
                    style={{ alignItems: "center", width: 80, marginBottom: 20 }}
                  >
                    <View
                      style={{
                        backgroundColor: isSelecionado ? "#93c5fd" : "#d9d9d9",
                        width: 60,
                        height: 60,
                        borderRadius: 12,
                        marginBottom: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </View>
                    <Text style={{ fontSize: 12, textAlign: "center" }}>
                      {item.nome === "Outro" && especialidade === especialidadeOutro && especialidadeOutro
                        ? `Outro\n(${especialidadeOutro})`
                        : item.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* inputs */}
            <Text className="text-base font-semibold mb-1">Data</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base" placeholder="AAAA-MM-DD" value={data} onChangeText={setData} />
            <Text className="text-base font-semibold mb-1">Hora</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base" placeholder="HH:MM:SS" value={hora} onChangeText={setHora} />
            <Text className="text-base font-semibold mb-1">Local</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base" placeholder="ex: Hospital" value={local} onChangeText={setLocal} />
            <Text className="text-base font-semibold mb-1">Observações</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base" placeholder="ex: Levar CPF e RG" value={observacoes} onChangeText={setObservacoes} />
            <Text className="text-base font-semibold mb-1">Horários</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-4 text-base" placeholder="Horários" value={horarios} onChangeText={setHorarios} />

            {/* botões */}
            <View className="flex-row justify-between">
              <TouchableOpacity className="bg-blue-600 rounded-xl px-6 py-2 mr-2" onPress={adicionarConsulta}>
                <Text className="text-white font-bold text-base">Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-blue-300 rounded-xl px-6 py-2" onPress={() => setModalAddVisible(false)}>
                <Text className="text-white font-bold text-base">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Outro */}
      <Modal visible={modalOutroVisible} animationType="fade" transparent={true} onRequestClose={() => setModalOutroVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white rounded-2xl p-6 w-10/12">
            <Text className="text-lg font-bold mb-4">Digite a Especialidade</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-4 text-base"
              placeholder="Especialidade personalizada"
              value={especialidadeOutro}
              onChangeText={setEspecialidadeOutro}
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-blue-600 rounded-xl px-6 py-2 mr-2"
                onPress={() => {
                  if (especialidadeOutro.trim() !== "") {
                    setEspecialidade(especialidadeOutro);
                  }
                  setModalOutroVisible(false);
                }}
              >
                <Text className="text-white font-bold">OK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-400 rounded-xl px-6 py-2"
                onPress={() => {
                  setModalOutroVisible(false);
                }}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
