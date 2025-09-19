import react, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { IoArrowBack, IoAddSharp } from "react-icons/io5";
import { Ionicons } from "@expo/vector-icons";
import { enderecoServidor } from "../utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Consultas({ navigation }) {
  const [dadosLista, setDadosLista] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [especialidade, setEspecialidade] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [horarios, setHorarios] = useState("");
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [atualizarConsultas, setAtualizarConsultas] = useState(false);
  const [id_usuario, setIdUsuario] = useState();

  //executa quando a variavel usuario é carregada
  useEffect(() => {
    if (usuario && usuario.token) {
      buscarDadosAPI();
    }
  }, [usuario]);

  const botaoExcluir = async (id) => {
    try {
      const resposta = await fetch(`${enderecoServidor}/consultas/${id}`, {
        method: "DELETE",
      });
      if (resposta.ok) {
        setDadosLista((prev) =>
          prev.filter((c) => c.id_consulta !== id_consulta)
        );
      } else {
        console.error("Erro ao excluir:", resposta.status);
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
          console.log("Usuário logado carregado:", usuario);
          setUsuario(usuario); // <- adiciona isso
          setIdUsuario(usuario.id_usuario);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };
    carregarUsuario();
  }, []);

  //   const buscarUsuarioLogado = async () => {
  //     const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado");
  //     if (usuarioLogado) {
  //       setUsuario(JSON.parse(usuarioLogado));
  //     } else {
  //       navigation.navigate("Login");
  //     }
  //   };

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
      console.log("Enviando consulta:", {
        id_usuario,
        especialidade,
        data,
        hora,
        local,
        observacoes,
        horarios,
        ativo: true,
      });
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
        setData("");
        setHora("");
        setLocal("");
        setObservacoes("");
        setHorarios("");
        setAtualizarConsultas((prev) => !prev);
      } else {
        Alert.alert("Erro ao adicionar consulta");
      }
    } catch (erro) {
      Alert.alert("Erro ao adicionar consulta");
    }
  };

  const exibirItemLista = ({ item }) => {
    return (
      <View className="bg-gray-200 rounded-3xl p-4 m-2 w-48">
        <View className="flex-row items-center mb-2">
          <View className="w-8 h-8 rounded-full bg-blue-600 mr-2" />
          <View>
            <Text
              className="font-bold text-sm "
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.especialidade}
            </Text>
            <Text className="text-blue-600 text-xs mt-2 mb-2">
              {item.data.split("T")[0].split("-").reverse().join("/")}
            </Text>
            <Text className="text-blue-600 text-xs">{item.hora}</Text>
          </View>
        </View>
        <Text className="text-black text-xs mb-6">{item.observacoes}</Text>
        <TouchableOpacity className="bg-white px-3 py-1 rounded-full self-end flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
          <Text className="text-blue-500 text-xs">Horários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="self-end mt-2"
          onPress={() => deletarConsulta(item.id_consulta)}
        >
          <Ionicons name="trash" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="flex-row justify-between mt-2 mb-6 items-center">
        <TouchableOpacity
          className="bg-gray-200 rounded-full px-4 py-2 mb-6 text-center"
          onPress={() => navigation.goBack()}
        >
          <Text>
            <IoArrowBack className="h-6 w-6" />
          </Text>
        </TouchableOpacity>

        <Text className="text-2xl text-black mb-4 font-sans font-bold">
          Consultas
        </Text>

        <TouchableOpacity
          className="bg-gray-200 rounded-full px-4 py-2 mb-6 text-center"
          onPress={() => setModalAddVisible(true)}
        >
          <Text className="font-thin">
            <IoAddSharp className="h-6 w-6" />
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex items-center justify-center">
        <Image
          source={require("../assets/calendarinho.png")}
          style={{ height: 150, width: 150 }}
        />
      </View>

      <View className="items-center justify-center p-4 mt-4">
        <Text className="text-xl font-sans">Suas Consultas</Text>
      </View>

      {/* cards para as consultas */}

      <FlatList
        data={dadosLista}
        renderItem={exibirItemLista}
        keyExtractor={(item, index) => String(item.id_consulta || index)}
        numColumns={2}
        contentContainerStyle={{ alignItems: "center" }}
      />

      {/* Modal para adicionar consulta */}
      <Modal
        visible={modalAddVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalAddVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-blue-700 mb-4">
              Adicionar Consulta
            </Text>

            <Text className="text-base font-semibold mb-1">Especialidade</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base"
              placeholder="ex: Cardiologia..."
              value={especialidade}
              onChangeText={setEspecialidade}
            />

            <Text className="text-base font-semibold mb-1">Data</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base"
              placeholder="AAAA-MM-DD"
              value={data}
              onChangeText={setData}
            />

            <Text className="text-base font-semibold mb-1">Hora</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base"
              placeholder="HH:MM:SS"
              value={hora}
              onChangeText={setHora}
            />

            <Text className="text-base font-semibold mb-1">Local</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base"
              placeholder="ex: Hospital dos olhos roxos"
              value={local}
              onChangeText={setLocal}
            />

            <Text className="text-base font-semibold mb-1">Observações</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base"
              placeholder="ex: Levar CPF e RG"
              value={observacoes}
              onChangeText={setObservacoes}
            />

            <Text className="text-base font-semibold mb-1">Horários</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-4 text-base"
              placeholder="Horários"
              value={horarios}
              onChangeText={setHorarios}
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-blue-600 rounded-xl px-6 py-2 mr-2"
                onPress={adicionarConsulta}
              >
                <Text className="text-white font-bold text-base">Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-300 rounded-xl px-6 py-2"
                onPress={() => setModalAddVisible(false)}
              >
                <Text className="text-white font-bold text-base">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
