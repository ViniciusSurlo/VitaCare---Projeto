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
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Documento() {
    return(
        <View>
            <Text className='font-sans font-bold text-blue-400 flex justify-center items-center mt-6'>Selecione aqui o que deseja acessar</Text>
                {/* Seção Medicamentos */}
            <View style={styles.remediosHeader} onPress={() => navigation.navigate("Medicamentos")}>
                <TouchableOpacity>
                    <Text style={{ color: "#2683ff" }}>+ Ver Mais</Text>
                </TouchableOpacity>
                </View>

             {/* Cards */}
             <View style={styles.cards}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Configuracoes')}>
                <FontAwesome6 name="gear" size={24} color="2b58de" />
                <Text style={styles.cardTitle}>Configurações</Text>
                <Text style={styles.cardSub}>Veja aqui as configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Perfil')}>
                <MaterialIcons name="account-box" size={24} color="#2b58de" />
                <Text style={styles.cardTitle}>Perfil</Text>
                <Text style={styles.cardSub}>Veja aqui seu perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Historico')}>
                <FontAwesome name="newspaper-o" size={24} color="#2b58de" />
                <Text style={styles.cardTitle}>Histórico de consulta</Text>
                <Text style={styles.cardSub}>Veja aqui seu histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("Notificacoes")}
            >
                <Entypo name="bell" size={24} color="#2b58de" />
                <Text style={styles.cardTitle}>Notificações</Text>
                <Text style={styles.cardSub}>Veja aqui suas notificações</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
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
    fontWeight: "bold",
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
    backgroundColor: "#c3e3fd",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
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
})