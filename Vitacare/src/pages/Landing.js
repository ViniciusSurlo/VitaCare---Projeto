import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TextInput, Pressable, Platform} from "react-native";
// import { Calendar } from "react-native-calendars"; // Importando o calendário, se necessário
import { supabase } from "../../lib/supabaseClient";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { enderecoServidor } from "../utils";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';


export default function Landing() {
  //estados para modal consulta
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [dbProvider, setDbProvider] = useState("supabase"); // ou "postgres"
  const [remedios, setRemedios] = useState([]);

  //const para os dados do remedio do usuario
  const [modalRemedioVisible, setModalRemedioVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [data_inicio, setdata_inicio] = useState("");
  const [data_fim, setdata_fim] = useState("");
  const [horarios, setHorarios] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

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
      const dataFormatada = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
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
          console.log(usuario);
          
          setIdUsuario(usuario.id_usuario); // ou o nome correto da chave retornada
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };

    carregarUsuario();
  }, []);

  //para carregar os remedios do usuario
  useEffect(() => {
    const carregarRemedios = async () => {
      try {
        const resposta = await fetch(`${enderecoServidor}/medicamentos`);
        const dados = await resposta.json();
        if (resposta.ok) {
          setRemedios(dados); // Atualiza o estado com os remédios recebidos
        } else {
          console.error("Erro ao carregar os remédios:", dados.error);
        }
      } catch (erro) {
        console.error("Erro ao buscar os remédios:", erro);
      }
    };

    carregarRemedios();
  }, []);


  // Função para adicionar Remedio
  adicionarRemedio = async () => {
    try {
      if (nome === "" || observacoes === "" || dosagem === "" || frequencia === "" || data_inicio === "" || data_fim === "" || horarios === "") {
        throw new Error("Preencha todos os campos");
      }
      
      const novoRemedio = {
          id_usuario: idUsuario,
          nome: nome,
          observacoes: observacoes,
          dosagem: dosagem,
          frequencia: frequencia,
          data_inicio: data_inicio,
          data_fim: data_fim,
          horarios: horarios,
          ativo: true
      }
      console.log(novoRemedio);
      
      //autenticando utilizando a API de backend com o fetch e recebendo o token
      const resposta = await fetch(`${enderecoServidor}/medicamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoRemedio),
      });
      const dados = await resposta.json();
      console.log("resposta do servidor", resposta)
      console.log(dados);

      if (resposta.ok) {
        console.log("Registro bem-sucedido:", dados);
        alert("Remédio salvo com sucesso!");
      } else {
        throw new Error(dados.message || "Erro ao salvar o remédio");
      }
    } catch (error) {
      console.error("Erro ao salvar remedio:", error);
      alert(error.message);
      return;
    }
  }

  // Função de editar Remedio
  editarRemedio = async (idRemedio) =>{
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
  
      const resposta = await fetch(`${enderecoServidor}/medicamentos/${idRemedio}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(remedioAtualizado),
      });
  
      const dados = await resposta.json();
      console.log("Resposta do servidor:", resposta);
      console.log("Dados recebidos:", dados);
  
      if (resposta.ok) {
        console.log("Remédio atualizado com sucesso:", dados);
        alert("Remédio editado com sucesso!");
      } else {
        throw new Error(dados.message || "Erro ao editar o remédio");
      }
  
    } catch (error) {
      console.error("Erro ao editar remedio:", error);
      alert(error.message);
    }
  }

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
        <View style={{width: '80%'}}>
        <Image source={require("../assets/logo1.png")} style={styles.logo} />
        <Text style={styles.headerText}>Olá, <Text style={{fontStyle: 'italic'}}>Usuário!</Text> </Text>
        <Text style={styles.headerSubText}>Vamos cuidar da sua<Text style={{color: '#004AAD', fontWeight: 500}}> saúde? </Text> </Text>
        </View>
        <View style={{width: '20%', display: 'flex' }}> 
        <LinearGradient 
        colors={['#FAF4F4', '#DEE4F4']} 
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
      >
      </View>
     
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultas</Text>
        <View> 
      <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Adicione a consulta</Text>
        </TouchableOpacity>
        </View>

        {/* <View style={styles.calendar}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              console.log("Dia selecionado:", day);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "#004AAD",
              },
            }}
            theme={{
              backgroundColor: "#004AAD",
              calendarBackground: "#004AAD",
              textSectionTitleColor: "#fff",
              selectedDayBackgroundColor: "#2b8fff",
              selectedDayTextColor: "#fff",
              todayTextColor: "#A6CCFD",
              dayTextColor: "#fff",
              arrowColor: "#2b8fff",
              monthTextColor: "#ffff",
            }}
          />
        </View>
        {selectedDate ? (
          <Text style={styles.selectedDateText}>
            Data Selecionada: {selectedDate}
          </Text>
        ) : null}
      </View> */}

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
                <Text style={styles.cardSubtitle}>Dosagem: {remedio.dosagem}</Text>
                <Text style={styles.cardSubtitle}>Frequência: {remedio.frequencia}</Text>
                <Text style={styles.cardSubtitle}>Horários: {remedio.horarios}</Text>
                <Text style={styles.cardSubtitle}>Observações: {remedio.observacoes}</Text>
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
          setRemedioSelecionado({ ...remedioSelecionado, frequencia: text })
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
          setRemedioSelecionado({ ...remedioSelecionado, data_inicio: text })
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
          setRemedioSelecionado({ ...remedioSelecionado, observacoes: text })
        }
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={salvarEdicao}
      >
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


      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Medicações <AntDesign name="medicinebox" size={24} color="black" /></Text>
  {/* if ternário para verificar se o tamanho do array é maior que 0 */}
  {remedios.length > 0 ? (
    remedios
      .filter((remedio) => remedio.ativo) // Filtra apenas os remédios com ativo = true
      .map((remedio) => (
        <View key={remedio.id_medicamento} style={styles.card}>
          <Text style={styles.cardTitle}>{remedio.nome}</Text>
          <Text style={styles.cardSubtitle}>Dosagem: {remedio.dosagem}</Text>
          <Text style={styles.cardSubtitle}>Frequência: {remedio.frequencia}</Text>
          <Text style={styles.cardSubtitle}>Observações: {remedio.observacoes}</Text>
          
          {/* Botões para editar e deletar */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => abrirModalEditar(remedio)} // Abre o modal de edição
            >
              <Text style={styles.cardButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => {
                console.log("Deletar remédio:", remedio.id_medicamento);
              }}
            >
              <Text style={styles.cardButtonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))
  ) : (
    <Text style={styles.noDataText}>Nenhum remédio disponível.</Text>
  )}
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
            <TouchableOpacity
              style={styles.saveButton}     
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity> 
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para adicionar remédio */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalRemedioVisible}
  onRequestClose={() => setModalRemedioVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Adicionar Remédio</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do remédio"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações (ex: tomar com água)"
        placeholderTextColor="#aaa"
        value={observacoes}
        onChangeText={setObservacoes}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosagem (ex: 30 mg, 10 ml)"
        placeholderTextColor="#aaa"
        value={dosagem}
        onChangeText={setDosagem}
      />
      <TextInput
        style={styles.input}
        placeholder="Frequência (ex: 2x ao dia)"
        placeholderTextColor="#aaa"
        value={frequencia}
        onChangeText={setFrequencia}
      />

      {/* Textinput com calendario */}
      {/* Funcionalidade incompatibilidade quando testado na web */}
      {/* Habilitar quando testar no celular */}
      {/* <Pressable onPress={() => setMostrarPicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Data de início (YYYY-MM-DD)"
          placeholderTextColor="#aaa"
          value={data_inicio}
          editable={false} // impede edição manual
          pointerEvents="none" // impede interação direta no Android
        />
      </Pressable>

      {mostrarPicker && (
        <DateTimePicker
          value={dataSelecionada}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )} */}
      <TextInput
        style={styles.input}
        placeholder="Data de início (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={data_inicio}
        onChangeText={setdata_inicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de fim (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={data_fim}
        onChangeText={setdata_fim}
      />
      <TextInput
        style={styles.input}
        placeholder="Horários (ex: 08:00, 12:00)"
        placeholderTextColor="#aaa"
        value={horarios}
        onChangeText={setHorarios}
      />
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          adicionarRemedio()
          setModalRemedioVisible(false);
        }}
      >
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setModalRemedioVisible(false)}
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
    backgroundColor: "#f8fafc",
    padding: 20,
    
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
    display: 'flex',
    justifyContent: "space-between",
    marginBottom: 20,
    flexDirection: 'row',
    margin: 10
  },
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
    width: '60%',
    height: '60%',
    marginLeft: -10
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
    alignItems: 'center',
    flexDirection: 'center',
    justifyContent: 'center',
    marginTop: '20%'
  },
  noDataText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 10,
  },
});
