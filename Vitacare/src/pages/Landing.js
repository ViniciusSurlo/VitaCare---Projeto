import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TextInput} from "react-native";
import { Calendar } from "react-native-calendars"; // Importando o calendário, se necessário
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Landing() {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [dbProvider, setDbProvider] = useState("supabase"); // ou "postgres"
  const [modalRemedioVisible, setModalRemedioVisible] = useState(false);
  const [nomeRemedio, setNomeRemedio] = useState("");
  const [dosagem, setDosagem] = useState("");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerText}>Bem-vindo!</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Adicione a consulta</Text>
        </TouchableOpacity>
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
        <View style={styles.calendar}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              console.log("Dia selecionado:", day);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "#2b8fff",
              },
            }}
            theme={{
              backgroundColor: "#f8fafc",
              calendarBackground: "#e2e8f0",
              textSectionTitleColor: "#1e293b",
              selectedDayBackgroundColor: "#2b8fff",
              selectedDayTextColor: "#fff",
              todayTextColor: "#2b8fff",
              dayTextColor: "#1e293b",
              arrowColor: "#2b8fff",
              monthTextColor: "#1e293b",
            }}
          />
        </View>
        {selectedDate ? (
          <Text style={styles.selectedDateText}>
            Data Selecionada: {selectedDate}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
      <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalRemedioVisible(true)}
        >
          <Text style={styles.addButtonText}>Adicione o Remédio</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Remédios de Hoje</Text> 
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aspirina</Text>
          <Text style={styles.cardSubtitle}>Dosagem: 30.8 ml</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ibuprofeno</Text>
          <Text style={styles.cardSubtitle}>Dosagem: 15.0 - 30 ml</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medicações <AntDesign name="medicinebox" size={24} color="black" /></Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aspirina</Text>
          <Text style={styles.cardSubtitle}>30.8 ml</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ibuprofeno</Text>
          <Text style={styles.cardSubtitle}>15.0 - 30 ml</Text>
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
            <TouchableOpacity
              style={styles.saveButton}
  
              onPress={() => {
                  console.log("it does nothing");
                }
              } 
       
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
        value={nomeRemedio}
        onChangeText={setNomeRemedio}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosagem (ex: 30 mg, 10 ml)"
        placeholderTextColor="#aaa"
        value={dosagem}
        onChangeText={setDosagem}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          // console.log("Remédio salvo:", nomeRemedio, dosagem);
          
          // Aqui você pode integrar com Supabase ou PostgreSQL depois
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  addButton: {
    backgroundColor: "#2683ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
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
    backgroundColor: "#e2e8f0",
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
});
