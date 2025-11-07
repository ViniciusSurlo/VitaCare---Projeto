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
  ScrollView,
} from "react-native";
import { enderecoServidor } from "../utils";
import { IoAddSharp } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";
import { MdEdit, MdDelete } from "react-icons/md";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Medicamentos({ navigation }) {
  const [remedios, setRemedios] = useState([]);
  const [atualizarRemedios, setAtualizarRemedios] = useState(false);
  const [remedioSelecionado, setRemedioSelecionado] = useState(null);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);

  // Variáveis de data e hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerFim, setShowDatePickerFim] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHorarios, setSelectedHorarios] = useState([]);
  const [diasTratamento, setDiasTratamento] = useState("");

  // Estado para controlar card expandido
  const [remedioExpandido, setRemedioExpandido] = useState(null);

  const [id_usuario, setIdUsuario] = useState();
  const [nome, setNome] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [data_inicio, setDataInicio] = useState("");
  const [data_fim, setDataFim] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [horarios, setHorarios] = useState("");
  const [usuario, setUsuario] = useState({});

  const abrirModalEditar = (remedio) => {
    setRemedioSelecionado(remedio);
    setModalEditVisible(true);
  };

  useEffect(() => {
  const carregarUsuario = async () => {
    try {
      const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
      if (usuarioJSON) {
        const usuario = JSON.parse(usuarioJSON);
        const id = usuario.id_usuario
        setIdUsuario(id);
      }
    } catch (erro) {
      console.error("Erro ao carregar usuário logado:", erro);
    }
  };
  carregarUsuario();
}, []);

useEffect(() => {
  const carregarRemedios = async () => {
    try { 
      if (!id_usuario) return;
      const resposta = await fetch(`${enderecoServidor}/medicamentos/usuario/${id_usuario}`);
      const dados = await resposta.json();
      if (resposta.ok) {
        // garante que sempre será array
        setRemedios(Array.isArray(dados) ? dados : []);
      }
    } catch (erro) {
      console.error("Erro ao buscar os remédios:", erro);
    }
  };

  carregarRemedios();
}, [id_usuario, atualizarRemedios]);

  const abrirModalAdd = () => {
    const hoje = new Date();
    const formatada = hoje.toISOString().split("T")[0]; // yyyy-mm-dd
    setDataInicio(formatada);
    setDataFim("");
    setDiasTratamento("");
    setModalAddVisible(true);
  };

  // Handler para mudanças de data e hora
  const onDateTimeChange = (event, selected) => {
    if (pickerMode === 'date') {
      // Fecha o picker
      setShowDatePicker(false);
      setShowDatePickerFim(false);
      
      if (selected) {
        const formatada = selected.toISOString().split("T")[0];
        
        // Verifica qual picker de data está ativo
        if (showDatePicker) {
          setDataInicio(formatada);
          
          // Recalcula data_fim se já tiver dias
          if (diasTratamento) {
            const fim = new Date(selected);
            fim.setDate(fim.getDate() + parseInt(diasTratamento));
            setDataFim(fim.toISOString().split("T")[0]);
          }
        } else if (showDatePickerFim) {
          setDataFim(formatada);
        }
      }
    } else if (pickerMode === 'time') {
      // Fecha o picker de hora
      setShowTimePicker(false);
      
      if (selected) {
        const hora = selected.getHours().toString().padStart(2, '0');
        const minutos = selected.getMinutes().toString().padStart(2, '0');
        const horarioFormatado = `${hora}:${minutos}`;
        
        // Adiciona o horário à lista se ainda não existir
        if (!selectedHorarios.includes(horarioFormatado)) {
          const novosHorarios = [...selectedHorarios, horarioFormatado].sort();
          setSelectedHorarios(novosHorarios);
          setHorarios(novosHorarios.join(', '));
        }
      }
    }
  };

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
          id_usuario,
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
        setAtualizarRemedios((prev) => !prev);
      } else {
        Alert.alert("Erro ao adicionar remédio");
      }
    } catch (erro) {
      Alert.alert("Erro ao adicionar remédio");
    }
  };

  const handleDiasTratamentoChange = (valor) => {
    setDiasTratamento(valor);
    if (data_inicio && valor) {
      const inicio = new Date(data_inicio);
      const fim = new Date(inicio);
      fim.setDate(fim.getDate() + parseInt(valor));
      setDataFim(fim.toISOString().split("T")[0]);
    } else {
      setDataFim("");
    }
  };

  const botaoExcluir = async (id) => {
    try {
      const resposta = await fetch(`${enderecoServidor}/medicamentos/${id}`, {
        method: "DELETE",
      });
      if (resposta.ok) {
        setAtualizarRemedios((prev) => !prev);
      } else {
        console.error("Erro ao excluir:", resposta.status);
      }
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
    }
  };

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

      const resposta = await fetch(
        `${enderecoServidor}/medicamentos/${idRemedio}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(remedioAtualizado),
        }
      );

      const dados = await resposta.json();
      if (resposta.ok) {
        setRemedios((prev) =>
          prev.map((remedio) =>
            remedio.id_medicamento === idRemedio
              ? { ...remedio, ...remedioAtualizado }
              : remedio
          )
        );
        setModalEditVisible(false);
      } else {
        throw new Error(dados.message || "Erro ao editar o remédio");
      }
    } catch (error) {
      console.error("Erro ao editar remedio:", error);
      alert(error.message);
    }
  };

  // 🔹 Agora o renderRemedio é o expansível (do código 1)
  const renderRemedio = ({ item: remedio }) => (
    <View
      key={remedio.id_medicamento}
      className="bg-gray-100 rounded-xl shadow p-4 mb-4 border border-gray-200"
    >
      <View className="flex-row flex justify-between items-center">
        <View className="flex-row gap-3">
          <View className="bg-blue-500 flex-row items-center justify-center p-4 rounded-full">
            <GiMedicines className="h-6 w-6 color-white" />
          </View>

          <View className="flex">
            <Text className="text-2xl font-thin text-black font-sans ">
              {remedio.nome}
            </Text>
            <Text className="text-base text-blue-500 text-bold font-semibold">
              {remedio.dosagem}
            </Text>
          </View>
        </View>

        {/* Botão Ver Mais */}
        <TouchableOpacity
          onPress={() =>
            setRemedioExpandido(
              remedioExpandido === remedio.id_medicamento
                ? null
                : remedio.id_medicamento
            )
          }
          style={{ padding: 5 }}
          className="border-4 flex flex-row border-white bg-gray-100 rounded-full justify-center items-center space-x-2"
        >
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 25,
              backgroundColor: "blue",
            }}
          />
          <Text className="text-black font-sans">Ver Mais</Text>
        </TouchableOpacity>
      </View>

      {remedioExpandido === remedio.id_medicamento && (
        <View className="mt-3">
          <Text className="text-base text-gray-700">
            Frequência:{" "}
            <Text className="font-semibold">{remedio.frequencia}</Text>
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            Observações: <Text className="italic">{remedio.observacoes}</Text>
          </Text>
          <View className="flex-row space-x-2 mt-2">
            {/* Botão Editar */}
            <TouchableOpacity
              style={{
                backgroundColor: "#2196F3",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                marginRight: 8,
              }}
              onPress={() => abrirModalEditar(remedio)}
            >
              <MaterialIcons
                name="edit"
                size={15}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
              >
                Editar
              </Text>
            </TouchableOpacity>

            {/* Botão Excluir */}
            <TouchableOpacity
              style={{
                backgroundColor: "#80A5D3",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                marginRight: 8,
              }}
              onPress={() => botaoExcluir(remedio.id_medicamento)}
            >
              <MaterialIcons
                name="delete"
                size={15}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
              >
                Deletar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  {
  return (
  <View className="flex-1 bg-gray-50 px-4 pt-6">
    {/* Header fixo */}
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
        Medicamentos
      </Text>

      <TouchableOpacity
        className="bg-gray-200 rounded-full px-4 py-2 mb-6 text-center"
        onPress={abrirModalAdd}
      >
        <Text className="font-thin">
          <IoAddSharp className="h-6 w-6" />
        </Text>
      </TouchableOpacity>
    </View>

    {/* ScrollView que permite rolar tudo junto */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Imagem e título que agora rolam */}
      <View className="flex items-center justify-center">
        <Image
          source={require("../assets/remedinho.png")}
          style={{ height: 150, width: 150 }}
        />
      </View>

      <View className="items-center justify-center p-4 mt-4">
        <Text className="text-xl font-sans">Seus Medicamentos</Text>
      </View>

      {/* Lista de medicamentos */}
      {remedios.filter((remedio) => remedio.ativo).length > 0 ? (
        remedios
          .filter((remedio) => remedio.ativo)
          .map((remedio) => (
            <View key={remedio.id_medicamento}>
              {renderRemedio({ item: remedio })}
            </View>
          ))
      ) : (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500 text-center">
            Nenhum remédio disponível.
          </Text>
        </View>
      )}
    </ScrollView>

        {/* Modal para adicionar remédio  */}
        <Modal
          visible={modalAddVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalAddVisible(false)}
        >
          <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Medicamento</Text>
              <Text style={styles.CampoTitulo}>Nome do remédio</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Rivotril"
                value={nome}
                onChangeText={setNome}
              />
              <Text style={styles.CampoTitulo}>Frequência </Text>
              <TextInput
                style={styles.input}
                placeholder="Quantas vezes ao dia?"
                value={frequencia}
                onChangeText={setFrequencia}
              />
              <Text style={styles.CampoTitulo}>Observações</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Tomar com água..."
                value={observacoes}
                onChangeText={setObservacoes}
              />
              <Text style={styles.CampoTitulo}>Dosagem </Text>
              <TextInput
                style={styles.input}
                placeholder="Quantos mg por dia?"
                value={dosagem}
                onChangeText={setDosagem}
              />
              <Text style={styles.CampoTitulo}>Data Início</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setPickerMode('date');
                  setShowDatePicker(true);
                }}
              >
                <Text>{data_inicio || "Selecione a data início"}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={data_inicio ? new Date(data_inicio) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateTimeChange}
                />
              )}

              <Text style={styles.CampoTitulo}>Dias de Tratamento</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 7"
                keyboardType="numeric"
                value={diasTratamento}
                onChangeText={handleDiasTratamentoChange}
              />

              <Text style={styles.CampoTitulo}>Data Fim</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setPickerMode('date');
                  setShowDatePickerFim(true);
                }}
              >
                <Text>{data_fim || "Selecione a data fim"}</Text>
              </TouchableOpacity>

              <Text style={styles.CampoTitulo}>Horários de Medicação</Text>
              <View style={styles.horariosContainer}>
                {selectedHorarios.map((horario, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.horarioChip}
                    onPress={() => {
                      const novosHorarios = selectedHorarios.filter(h => h !== horario);
                      setSelectedHorarios(novosHorarios);
                      setHorarios(novosHorarios.join(', '));
                    }}
                  >
                    <Text style={styles.horarioChipText}>{horario}</Text>
                    <Text style={styles.horarioChipDelete}>×</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addHorarioBtn}
                  onPress={() => {
                    setPickerMode('time');
                    setShowTimePicker(true);
                  }}
                >
                  <Text style={styles.addHorarioText}>+ Adicionar Horário</Text>
                </TouchableOpacity>
              </View>

              {/* Date Picker para Data Fim */}
              {showDatePickerFim && (
                <DateTimePicker
                  value={data_fim ? new Date(data_fim) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateTimeChange}
                  minimumDate={data_inicio ? new Date(data_inicio) : undefined}
                />
              )}

              {/* Time Picker para Horários */}
              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={onDateTimeChange}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#2196F3" }]}
                  onPress={adicionarRemedio}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#80A5D3" }]}
                  onPress={() => setModalAddVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </ScrollView>
        </Modal>

        {/* Modal Edição */}
        <Modal
          visible={modalEditVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalEditVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Remédio</Text>

              <TextInput
                style={styles.input}
                placeholder="Nome do remédio"
                value={remedioSelecionado?.nome || ""}
                onChangeText={(text) =>
                  setRemedioSelecionado({ ...remedioSelecionado, nome: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Dosagem (quantos gramas ou miligramas)"
                value={remedioSelecionado?.dosagem || ""}
                onChangeText={(text) =>
                  setRemedioSelecionado({
                    ...remedioSelecionado,
                    dosagem: text,
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Quantas vezes ao dia?"
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
                placeholder="Observações"
                value={remedioSelecionado?.observacoes || ""}
                onChangeText={(text) =>
                  setRemedioSelecionado({
                    ...remedioSelecionado,
                    observacoes: text,
                  })
                }
              />
              <Text style={styles.CampoTitulo}>Data Início</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setPickerMode('date');
                  setShowDatePicker(true);
                }}
              >
                <Text>{remedioSelecionado?.data_inicio || "Selecione a data início"}</Text>
              </TouchableOpacity>

              <Text style={styles.CampoTitulo}>Data Fim</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setPickerMode('date');
                  setShowDatePickerFim(true);
                }}
              >
                <Text>{remedioSelecionado?.data_fim || "Selecione a data fim"}</Text>
              </TouchableOpacity>

              {/* Date Picker para Data Início */}
              {showDatePicker && (
                <DateTimePicker
                  value={remedioSelecionado?.data_inicio ? new Date(remedioSelecionado.data_inicio) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selected) => {
                    setShowDatePicker(false);
                    if (selected) {
                      setRemedioSelecionado({
                        ...remedioSelecionado,
                        data_inicio: selected.toISOString().split('T')[0]
                      });
                    }
                  }}
                />
              )}

              {/* Date Picker para Data Fim */}
              {showDatePickerFim && (
                <DateTimePicker
                  value={remedioSelecionado?.data_fim ? new Date(remedioSelecionado.data_fim) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selected) => {
                    setShowDatePickerFim(false);
                    if (selected) {
                      setRemedioSelecionado({
                        ...remedioSelecionado,
                        data_fim: selected.toISOString().split('T')[0]
                      });
                    }
                  }}
                  minimumDate={remedioSelecionado?.data_inicio ? new Date(remedioSelecionado.data_inicio) : undefined}
                />
              )}
              <Text style={styles.CampoTitulo}>Horários de Medicação</Text>
              <View style={styles.horariosContainer}>
                {(remedioSelecionado?.horarios || '').split(', ').filter(h => h).map((horario, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.horarioChip}
                    onPress={() => {
                      const horarios = remedioSelecionado.horarios.split(', ').filter(h => h !== horario);
                      setRemedioSelecionado({
                        ...remedioSelecionado,
                        horarios: horarios.join(', ')
                      });
                    }}
                  >
                    <Text style={styles.horarioChipText}>{horario}</Text>
                    <Text style={styles.horarioChipDelete}>×</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addHorarioBtn}
                  onPress={() => {
                    setPickerMode('time');
                    setShowTimePicker(true);
                  }}
                >
                  <Text style={styles.addHorarioText}>+ Adicionar Horário</Text>
                </TouchableOpacity>
              </View>

              {/* Time Picker para Horários */}
              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selected) => {
                    setShowTimePicker(false);
                    if (selected) {
                      const hora = selected.getHours().toString().padStart(2, '0');
                      const minutos = selected.getMinutes().toString().padStart(2, '0');
                      const horarioFormatado = `${hora}:${minutos}`;
                      const horariosAtuais = remedioSelecionado?.horarios?.split(', ').filter(h => h) || [];
                      
                      if (!horariosAtuais.includes(horarioFormatado)) {
                        const novosHorarios = [...horariosAtuais, horarioFormatado].sort().join(', ');
                        setRemedioSelecionado({
                          ...remedioSelecionado,
                          horarios: novosHorarios
                        });
                      }
                    }
                  }}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#2196F3" }]}
                  onPress={() =>
                    editarRemedio(remedioSelecionado.id_medicamento)
                  }
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#80A5D3" }]}
                  onPress={() => setModalEditVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    // flex: '50%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  horarioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  horarioChipText: {
    fontSize: 14,
    marginRight: 4,
  },
  horarioChipDelete: {
    fontSize: 18,
    color: '#666',
  },
  addHorarioBtn: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  addHorarioText: {
    color: '#666',
    fontSize: 14,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  CampoTitulo: {
    fontSize: 14,
    // marginTop: 5,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
