import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { enderecoServidor } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState({});
  const [dados, setDados] = useState({});
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [tipoEdit, setTipoEdit] = useState("");

  const abrirModalEditar = () => {
    setNomeEdit(dados.nome || "");
    setEmailEdit(dados.email || "");
    setTipoEdit(dados.tipo_usuario || "");
    setModalEditarVisible(true);
  };

  const salvarEdicao = async () => {
    try {
      const resposta = await fetch(
        `${enderecoServidor}/usuarios/${dados.id_usuario}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nomeEdit,
            email: emailEdit,
            tipo_usuario: tipoEdit,
          }),
        }
      );
      if (resposta.ok) {
        setDados({
          ...dados,
          nome: nomeEdit,
          email: emailEdit,
          tipo_usuario: tipoEdit,
        });
        setModalEditarVisible(false);
      } else {
        alert("Erro ao editar usuário.");
      }
    } catch (erro) {
      alert("Erro ao editar usuário.");
    }
  };

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);
          setUsuario(usuario);
          // Busca os dados completos do usuário
          const resposta = await fetch(
            `${enderecoServidor}/usuarios/${usuario.id_usuario}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${usuario.token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const dadosAPI = await resposta.json();
          setDados(dadosAPI);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
      }
    };
    carregarUsuario();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 items-center pt-12">
        {/* modal editar usuario */}
      <Modal
        visible={modalEditarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-blue-700 mb-4">
              Editar Usuário
            </Text>
            <Text className="text-base font-semibold mb-1">Nome</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base"
              value={nomeEdit}
              onChangeText={setNomeEdit}
            />
            <Text className="text-base font-semibold mb-1">Email</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-2 text-base"
              value={emailEdit}
              onChangeText={setEmailEdit}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text className="text-base font-semibold mb-1">
              Tipo de Usuário
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-2 mb-4 text-base"
              value={tipoEdit}
              onChangeText={setTipoEdit}
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-blue-600 rounded-xl px-6 py-2 mr-2"
                onPress={salvarEdicao}
              >
                <Text className="text-white font-bold text-base">Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-300 rounded-xl px-6 py-2"
                onPress={() => setModalEditarVisible(false)}
              >
                <Text className="text-white font-bold text-base">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Avatar */}
      <View className="bg-blue-200 rounded-full w-28 h-28 items-center justify-center mb-4">
        <Ionicons name="person" size={64} color="#2563eb" />
      </View>
      {/* Nome */}
      <Text className="text-2xl font-bold text-blue-900 mb-1">
        {dados.nome || "Usuário"}
      </Text>
      {/* Email */}
      <Text className="text-base text-gray-700 mb-2">
        {dados.email || "email@email.com"}
      </Text>
      {/* Tipo de usuário */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="shield-checkmark" size={20} color="#2563eb" />
        <Text className="ml-2 text-base text-blue-700 font-semibold">
          {dados.tipo_usuario ? dados.tipo_usuario : "Usuário"}
        </Text>
      </View>
      {/* Status */}
      <View className="flex-row items-center mb-6">
        <View
          className={`w-3 h-3 rounded-full ${
            dados.ativo ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <Text className="ml-2 text-base text-gray-600">
          {dados.ativo ? "Ativo" : "Inativo"}
        </Text>
      </View>
      <View className="flex-row space-x-4 mt-2">
        {/* Botão Editar */}
        <TouchableOpacity
          className="bg-blue-500 px-8 py-3 rounded-xl"
          onPress={abrirModalEditar}
        >
          <Text className="text-white font-bold text-lg">Editar Usuário</Text>
        </TouchableOpacity>

        {/* Botão Excluir */}
        <TouchableOpacity
          className="bg-gray-300 px-8 py-3 rounded-xl"
          onPress={async () => {
            // Confirmação antes de excluir
            if (confirm("Tem certeza que deseja excluir sua conta?")) {
              try {
                await fetch(
                  `${enderecoServidor}/usuarios/${dados.id_usuario}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${usuario.token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                await AsyncStorage.removeItem("UsuarioLogado");
                navigation.replace("Login");
              } catch (erro) {
                alert("Erro ao excluir usuário.");
              }
            }
          }}
        >
          <Text className="text-red-600 font-bold text-lg">
            Excluir Usuário
          </Text>
        </TouchableOpacity>
      </View>
      {/* Botão de sair */}
      <TouchableOpacity
        className="bg-red-500 px-8 py-3 rounded-xl mt-4"
        onPress={async () => {
          await AsyncStorage.removeItem("UsuarioLogado");
          navigation.replace("Login");
        }}
      >
        <Text className="text-white font-bold text-lg">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
