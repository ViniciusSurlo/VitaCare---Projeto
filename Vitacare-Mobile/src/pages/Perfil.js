import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  SafeAreaView, // Importado para melhor safe area
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ícone de Seta, Add, Pessoa
import { useNavigation } from "@react-navigation/native";
import { enderecoServidor } from "../utils"; // Importado do Perfil
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importado do Perfil

export default function Perfil() {
  const navigation = useNavigation();

  // --- Estados vindos do Perfil.js ---
  const [usuario, setUsuario] = useState({});
  const [dados, setDados] = useState({});
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [tipoEdit, setTipoEdit] = useState("");

  // --- Funções vindas do Perfil.js ---
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("UsuarioLogado");
    navigation.replace("Login");
  };

  const handleDeleteAccount = async () => {
    // Confirmação antes de excluir
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
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
  };

  // --- useEffect (lógica de carregar dados) vindo do Perfil.js ---
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
    // SafeAreaView para garantir que o conteúdo não fique sob a status bar
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* --- Modal de Edição (Estilo antigo mantido) --- */}
        <Modal
          visible={modalEditarVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalEditarVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Usuário</Text>
              
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.textInput}
                value={nomeEdit}
                onChangeText={setNomeEdit}
              />
              
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={emailEdit}
                onChangeText={setEmailEdit}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Text style={styles.inputLabel}>Tipo de Usuário</Text>
              <TextInput
                style={styles.textInput}
                value={tipoEdit}
                onChangeText={setTipoEdit}
              />
              
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={salvarEdicao}
                >
                  <Text style={styles.modalButtonTextWhite}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setModalEditarVisible(false)}
                >
                  <Text style={styles.modalButtonTextWhite}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#444" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={abrirModalEditar}
          >
            <Ionicons name="edit" size={24} color="#444" />
          </TouchableOpacity>
        </View>

        {/* Foto de Perfil */}
        <View style={styles.profileCircle}>
          
        </View>

        {/* Fundo cinza claro arredondado */}
        <View style={styles.contentSheet}>
          {/* Nome e Email */}
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{dados.nome || "Carregando..."}</Text>
            <Text style={styles.emailText}>{dados.email || "Carregando..."}</Text>
          </View>

          {/* Bloco de Ações */}
          <View style={styles.actionBox}>
            {/* Linha de Status */}
            <View style={styles.statusRow}>
              <View style={styles.statusGroup}>
                <Text style={styles.statusText}>
                  {dados.tipo_usuario || "Usuário"}
                </Text>
                <View style={styles.adminDot} />
              </View>
              <View style={styles.statusGroup}>
                <Text style={styles.statusText}>
                  {dados.ativo ? "Ativo" : "Inativo"}
                </Text>
                <View 
                  style={[
                    styles.activeDot, 
                    { backgroundColor: dados.ativo ? '#34C759' : '#FF3B30' } // Verde se ativo, Vermelho se inativo
                  ]} 
                />
              </View>
            </View>

            {/* Botões de Ação */}
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={abrirModalEditar}
            >
              <Text style={styles.buttonText}>Editar Usuário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.buttonText}>Excluir Usuário</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Novos Estilos (Baseados na Imagem) ---
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20
  },
  headerButton: {
    backgroundColor: "#F0F0F0",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  profileCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F0F0F0",
    borderWidth: 2,
    borderColor: "#007AFF", // Azul da imagem
    alignSelf: "center",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentSheet: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#666",
  },
  actionBox: {
    backgroundColor: "#EFEFEF",
    borderRadius: 20,
    width: "95%",
    padding: 20,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25, // Mais espaço antes dos botões
    paddingHorizontal: 10, // Pequeno padding interno
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginRight: 10,
  },
  adminDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#007AFF", // Azul
  },
  activeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    // A cor é definida dinamicamente no componente
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15, // Mais arredondado
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#007AFF", // Azul
  },
  deleteButton: {
    backgroundColor: "#007AFF", // Azul (como na imagem)
  },
  logoutButton: {
    backgroundColor: "#FF3B30", // Vermelho (padrão iOS para destrutivo)
  },

  // --- Estilos do Modal (Mantidos do código anterior) ---
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    flex: 1,
    alignItems: "center",
  },
  modalButtonSave: {
    backgroundColor: "#2563eb",
    marginRight: 8,
  },
  modalButtonCancel: {
    backgroundColor: "#93c5fd",
    marginLeft: 8,
  },
  modalButtonTextWhite: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});