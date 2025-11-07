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
  ScrollView
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

  const especialidades = [
    { nome: "Cardiologia", icon: <Ionicons name="heart-outline" size={28} color="#333" /> },
    { nome: "Pediatria", icon: <FontAwesome6 name="children" size={28} color="#333" /> },
    { nome: "Ginecologia", icon: <MaterialCommunityIcons name="gender-female" size={28} color="#333" /> },
    { nome: "Dermatologia", icon: <MaterialCommunityIcons name="face-man-outline" size={28} color="#333" /> },
    { nome: "Ortopedia", icon: <Ionicons name="walk-outline" size={28} color="#333" /> },
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
          const id = usuario.id_usuario          
          setIdUsuario(id);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };
    carregarUsuario();
  }, []);

  const buscarDadosAPI = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/consultas/usuario/${id_usuario}`, {
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
    if (id_usuario) {
      buscarDadosAPI();
    }
  }, [id_usuario, atualizarConsultas]);

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
    <View style={{ width: '100%', paddingHorizontal: 8, marginBottom: 16 }}>
      <View className="bg-white rounded-3xl p-5 shadow-sm">
        {/* Cabeçalho com círculo azul e info */}
        <View className="flex-row items-start mb-4">
          <View className="w-10 h-10 rounded-full bg-blue-600 mr-4" />
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-800">{item.especialidade}</Text>
              <Text className="text-gray-500 text-sm">
                {item.data.split("T")[0].split("-").reverse().join("/")} às {item.hora}
              </Text>
          </View>
          <TouchableOpacity onPress={() => botaoExcluir(item.id_consulta)} className="border-4 flex flex-row border-white bg-gray-100 rounded-full w-12 h-12 justify-center items-center space-x-2">
            <Ionicons name="trash-sharp" size={24} color="blue" />
          </TouchableOpacity>
        </View>

        {/* Área de observações */}
        <View className="bg-gray-100 rounded-2xl p-4 mb-4" style={{ minHeight: 80 }}>
          <Text className="text-gray-800 text-base leading-6">
            {item.observacoes || "Sem observações"}
          </Text>
        </View>

        {/* Info adicional */}
        <View className="flex-row gap-2 items-center flex-wrap">
          <MaterialCommunityIcons name="hospital-marker" size={24} color="blue" />
          <Text className="text-gray-500 text-sm">{item.local}</Text>
        </View>
      </View>
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
        <Image source={require("../assets/calendarinho.png")} style={{ height: 200, width: 200 }} />
      </View>

      <View className="items-center justify-center p-4 mt-4">
        <Text className="text-xl font-sans">Suas Consultas</Text>
      </View>

      {/* cards */}
      <FlatList
        data={dadosLista}
        renderItem={exibirItemLista}
        keyExtractor={(item, index) => String(item.id || index)}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* Modal principal */}
      
      <Modal visible={modalAddVisible} animationType="slide" transparent={true} onRequestClose={() => setModalAddVisible(false)}>
        <ScrollView>
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-blue-700 mb-4">Adicionar Consulta</Text>
            <Text className="text-base font-semibold mb-1">Especialidade do Doutor</Text>

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
            <Text className="text-base font-semibold mb-1">Horário da Consulta</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base" placeholder="HH:MM:SS" value={hora} onChangeText={setHora} />
            <Text className="text-base font-semibold mb-1">Local da Consulta</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base" placeholder="ex: Hospital" value={local} onChangeText={setLocal} />
            <Text className="text-base font-semibold mb-1">Observações</Text>
            <TextInput className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base" placeholder="ex: Levar CPF e RG" value={observacoes} onChangeText={setObservacoes} />
            <Text className="text-base font-semibold mb-1">Horários</Text>
            {/* adicionar a opção de "não sei se devo retornar novamente em outros horarios" */}
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
        </ScrollView>
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