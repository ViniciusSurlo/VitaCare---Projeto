import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { enderecoServidor } from "../utils";
import { IoAddSharp } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";
import { GiMedicines } from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Medicamentos({navigation}) {
  const [remedios, setRemedios] = useState([]);
  const [atualizarRemedios, setAtualizarRemedios] = useState(false);
  const [remedioSelecionado, setRemedioSelecionado] = useState(null);
  // Estados do modal de adicionar
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [id_usuario, setIdUsuario] = useState(); // Substitua pelo ID do usuário logado
  const [nome, setNome] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [data_inicio, setDataInicio] = useState("");
  const [data_fim, setDataFim] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [horarios, setHorarios] = useState("");
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [usuario, setUsuario] = useState({});

  // Função para abrir o modal de edição e preencher os campos
  const abrirModalEditar = (remedio) => {
    setRemedioSelecionado(remedio);
    setModalEditVisible(true);
  };

  useEffect(() => {
    const carregarRemedios = async () => {
      try {
        const resposta = await fetch(`${enderecoServidor}/medicamentos`);
        const dados = await resposta.json();
        if (resposta.ok) {
          setRemedios(dados);
        } else {
          console.error("Erro ao carregar os remédios:", dados.error);
        }
      } catch (erro) {
        console.error("Erro ao buscar os remédios:", erro);
      }
    };

    carregarRemedios();
  }, [atualizarRemedios]); // agora depende de atualizarRemedios

  //para carregar os dados do usuario logado
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);
          setIdUsuario(usuario.id_usuario);
          console.log(usuario);
          setUsuario(usuario);

          // setIdUsuario(usuario.id_usuario); // ou o nome correto da chave retornada
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };

    carregarUsuario();
  }, []);

  // Função para adicionar novo remédio
  const adicionarRemedio = async () => {
    if (!nome || !dosagem || !frequencia) {
      Alert.alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const resposta = await fetch(`${enderecoServidor}/medicamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: id_usuario, // Substitua pelo ID do usuário logado
          nome,
          observacoes,
          dosagem,
          frequencia,
          data_inicio,
          data_fim,
          horarios,
          ativo: true,
        }),
      });
      if (resposta.ok) {
        const novo = await resposta.json();
        setRemedios((prev) => [...prev, novo]);
        setModalAddVisible(false);
        setNome("");
        setDosagem("");
        setObservacoes("");
        setFrequencia("");
        setDataInicio("");
        setDataFim("");
        setHorarios("");
        setAtualizarRemedios((prev) => !prev); // Atualiza a lista de remédios
      } else {
        Alert.alert("Erro ao adicionar remédio");
      }
    } catch (erro) {
      Alert.alert("Erro ao adicionar remédio");
    }
  };

  // Função para renderizar cada item do FlatList
  const renderRemedio = ({ item: remedio }) => (
    <View
      key={remedio.id_medicamento}
      className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
    >
      <View className="flex-row flex">
        <View className=" bg-blue-500 flex-row  flex items-center justify-center p-4 mr-4 rounded-full">
          <GiMedicines className="h-6 w-6 color-white" />
        </View>
        <View className="flex-col ml-4">
          <Text className="text-2xl font-thin text-black font-sans ">
            {remedio.nome}
          </Text>
        	<Text className="text-base text-blue-500 text-bold font-semibold">
				{remedio.dosagem}
			</Text>
          
        </View>
      </View>
      <Text className="text-base text-gray-700">
        Frequência: <Text className="font-semibold">{remedio.frequencia}</Text>
      </Text>
      <Text className="text-base text-gray-700 mb-2">
        Observações: <Text className="italic">{remedio.observacoes}</Text>
      </Text>
      <View className="flex-row space-x-2 mt-2">
        <TouchableOpacity
          className="bg-blue-500 px-3 py-1 rounded"
          onPress={() => abrirModalEditar(remedio)}
        >
          <Text className="text-white font-semibold font-sans">Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 px-3 py-1 rounded"
          onPress={() => botaoExcluir(remedio.id_medicamento)}
        >
          <Text className="text-white font-semibold font-sans">Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const botaoExcluir = async (id) => {
    try {
      const resposta = await fetch(`${enderecoServidor}/medicamentos/${id}`, {
        method: "DELETE",
      });
      if (resposta.ok) {
          setAtualizarRemedios(prev => !prev)
      } else {
        console.error("Erro ao excluir:", resposta.status);
      }
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
    }
  };

  // Função de editar Remedio
  const editarRemedio = async (idRemedio) => {
    try {
      if (
        !remedioSelecionado.nome ||
        !remedioSelecionado.observacoes ||
        !remedioSelecionado.dosagem ||
        !remedioSelecionado.frequencia ||
        !remedioSelecionado.data_inicio ||
        !remedioSelecionado.data_fim ||
        !remedioSelecionado.horarios
      ) {
        throw new Error("Preencha todos os campos");
      }

      const remedioAtualizado = {
        nome: remedioSelecionado.nome,
        observacoes: remedioSelecionado.observacoes,
        dosagem: remedioSelecionado.dosagem,
        frequencia: remedioSelecionado.frequencia,
        data_inicio: remedioSelecionado.data_inicio,
        data_fim: remedioSelecionado.data_fim,
        horarios: remedioSelecionado.horarios,
        ativo: true,
      };

      console.log("Atualizando remédio:", remedioAtualizado);

      const resposta = await fetch(
        `${enderecoServidor}/medicamentos/${idRemedio}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(remedioAtualizado),
        }
      );

      const dados = await resposta.json();
      console.log("Resposta do servidor:", resposta);
      console.log("Dados recebidos:", dados);

      if (resposta.ok) {
        setRemedios((prev) =>
          prev.map((remedio) =>
            remedio.id_medicamento === idRemedio
              ? { ...remedio, ...remedioAtualizado }
              : remedio
          )
        );
        console.log("Remédio atualizado com sucesso:", dados);
        setModalEditVisible(false);
        // alert("Remédio editado com sucesso!");
      } else {
        throw new Error(dados.message || "Erro ao editar o remédio");
      }
    } catch (error) {
      console.error("Erro ao editar remedio:", error);
      alert(error.message);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      {/* Modal de editar remédio */}
      <Modal
        visible={modalEditVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalEditVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-xl p-6 w-11/12">
            <Text className="text-xl font-bold font-sans text-blue-600 mb-4">
              Editar Remédio
            </Text>
            <TextInput style={styles.inputView}
            //   className="border-3 border-gray-200 rounded-full "
              placeholder="Nome"
              value={remedioSelecionado?.nome || ""}
              onChangeText={(text) =>
                setRemedioSelecionado((prev) => ({ ...prev, nome: text }))
              }
            />
            <TextInput
			  style={styles.inputView}
            //   className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Observações"
              value={remedioSelecionado?.observacoes || ""}
              onChangeText={(text) =>
                setRemedioSelecionado((prev) => ({
                  ...prev,
                  observacoes: text,
                }))
              }
            />
            <TextInput
			  style={styles.inputView}
            //   className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Dosagem"
              value={remedioSelecionado?.dosagem || ""}
              onChangeText={(text) =>
                setRemedioSelecionado((prev) => ({ ...prev, dosagem: text }))
              }
            />
            <TextInput
            //   className="bg-gray-100 rounded px-3 py-2 mb-3"
			  style={styles.inputView}
              placeholder="Frequência"
              value={remedioSelecionado?.frequencia || ""}
              onChangeText={(text) =>
                setRemedioSelecionado((prev) => ({ ...prev, frequencia: text }))
              }
            />
            <TextInput
            //   className="bg-gray-100 rounded px-3 py-2 mb-3"
			  style={styles.inputView}
              placeholder="Data Início"
              value={remedioSelecionado?.data_inicio || ""}
              onChangeText={(text) =>
                setRemedioSelecionado((prev) => ({
                  ...prev,
                  data_inicio: text,
                }))
              }
            />
            <TextInput
            //   className="bg-gray-100 rounded px-3 py-2 mb-3"
			  style={styles.inputView}
              placeholder="Data Fim"
              value={remedioSelecionado?.data_fim || ""}
              onChangeText={(text) =>
                setRemedioSelecionado((prev) => ({ ...prev, data_fim: text }))
              }
            />
            <TextInput
            //   className="bg-gray-100 rounded px-3 py-2 mb-3"
			  style={styles.inputView}
              placeholder="Horários"
              value={remedioSelecionado?.horarios || ""}
              onChangeText={(text) =>
                setRemedioSelecionado((prev) => ({ ...prev, horarios: text }))
              }
            />
            <View className="flex-row justify-end space-x-2 mt-2">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded"
                onPress={() => setModalEditVisible(false)}
              >
                <Text className="text-gray-800 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded"
                onPress={() => editarRemedio(remedioSelecionado.id_medicamento)}
              >
                <Text className="text-white font-semibold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de adicionar remédio */}
      <Modal
        visible={modalAddVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalAddVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-xl p-6 w-11/12">
            <Text className="text-xl font-bold text-blue-800 mb-4">
              Adicionar Remédio
            </Text>
            <TextInput
              className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Observações"
              value={observacoes}
              onChangeText={setObservacoes}
            />
            <TextInput
              className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Dosagem"
              value={dosagem}
              onChangeText={setDosagem}
            />
            <TextInput
              className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Frequência"
              value={frequencia}
              onChangeText={setFrequencia}
            />
            <TextInput
              className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Data Início (AAAA-MM-DD)"
              value={data_inicio}
              onChangeText={setDataInicio}
            />
            <TextInput
              className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Data Fim"
              value={data_fim}
              onChangeText={setDataFim}
            />
            <TextInput
              className="bg-gray-100 rounded px-3 py-2 mb-3"
              placeholder="Horários"
              value={horarios}
              onChangeText={setHorarios}
            />
            <View className="flex-row justify-end space-x-2 mt-2">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded"
                onPress={() => setModalAddVisible(false)}
              >
                <Text className="text-gray-800 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded"
                onPress={adicionarRemedio}
              >
                <Text className="text-white font-semibold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View>
        {/* botao adicionar remedio */}
        <View className="flex-row justify-between mt-2 mb-6 items-center">
          {/* botao voltar */}
          <TouchableOpacity
            className="bg-gray-200 rounded-full px-4 py-2 mb-6 text-center"
            onPress={() => navigation.goBack()}
          >
            <Text>
              <IoArrowBack className="h-6 w-6" />
            </Text>
          </TouchableOpacity>

          <Text className="text-2xl text-black mb-4 font-sans font-bold">
            Remédios
          </Text>
			
          {/* botão adicionar */}
          <TouchableOpacity
            className="bg-gray-200 rounded-full px-4 py-2 mb-6 text-center"
            onPress={() => setModalAddVisible(true)}
          >
            <Text className="font-thin">
              <IoAddSharp className="h-6 w-6" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className=' flex items-center justify-center'>
           {/* Imagem de remédios */}
			<Image source={require("../assets/remedinho.png")}  style={{height: 250, width: 250}}/>
      </View>
      <View className="items-center justify-center p-4 mt-4">
        <Text className="text-xl font-sans">Seus Remédios</Text>
      </View>

      <FlatList
        data={remedios.filter((remedio) => remedio.ativo)}
        keyExtractor={(item) => item.id_medicamento.toString()}
        renderItem={renderRemedio}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            Nenhum remédio disponível.
          </Text>
        }
        contentContainerStyle={
          remedios.filter((remedio) => remedio.ativo).length === 0
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputView: {
    width: 300,
    height: 35,
    backgroundColor: "#ffff",
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#C9C9C9",
    borderWidth: 2.8,
    flexDirection: "row",
    justifyContent: "space-between",
  } 
});
