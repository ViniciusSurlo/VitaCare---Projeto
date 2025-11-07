import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { enderecoServidor } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIPOS_USUARIO = ["Admin", "Comum", "Editor"];

export default function Perfil() {
  const navigation = useNavigation();

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("UsuarioLogado");
    navigation.replace("Login");
  };

  const handleDeleteAccount = async () => {
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

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);
          setUsuario(usuario);
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
    <View style={styles.safeContainer}>
      <View style={styles.container}>
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
              <View style={styles.tipoUsuarioContainer}>
                {TIPOS_USUARIO.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoUsuarioButton,
                      tipoEdit === tipo && styles.tipoUsuarioButtonSelected,
                    ]}
                    onPress={() => setTipoEdit(tipo)}
                  >
                    <Text
                      style={[
                        styles.tipoUsuarioText,
                        tipoEdit === tipo && styles.tipoUsuarioTextSelected,
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

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
            <Ionicons name="pencil" size={24} color="#444" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCircle}>
          <Ionicons name="person" size={70} color="#007AFF" />
        </View>

        <View style={styles.contentSheet}>
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{dados.nome || "Carregando..."}</Text>
            <Text style={styles.emailText}>{dados.email || "Carregando..."}</Text>
          </View>

          <View style={styles.actionBox}>
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
                    { backgroundColor: dados.ativo ? '#34C759' : '#FF3B30' }
                  ]}
                />
              </View>
            </View>

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
    </View>
  );
}

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
    borderColor: "#007AFF",
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
    marginBottom: 25,
    paddingHorizontal: 10,
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
    backgroundColor: "#007AFF",
  },
  activeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#007AFF",
  },
  logoutButton: {
    backgroundColor: "#bfbfbf",
  },

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
    marginTop: 20,
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
  // NOVOS ESTILOS AJUSTADOS PARA OCUPAR MENOS ESPAÇO E ESTAR NA MESMA LINHA
  tipoUsuarioContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Distribui o espaço entre os botões
    marginBottom: 12,
    flexWrap: "wrap", // Garante responsividade quebrando a linha se necessário (embora TIPOS_USUARIO tenha apenas 3)
  },
  tipoUsuarioButton: {
    flex: 1, // Permite que o botão se expanda para ocupar o espaço disponível
    minWidth: 80, // Garante um tamanho mínimo para visualização
    paddingVertical: 8,
    paddingHorizontal: 5, // Reduzido o padding horizontal
    borderRadius: 15, // Mais arredondado, visualmente menor
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 3, // Reduzido o margin
    backgroundColor: "#f9f9f9",
    alignItems: "center", // Centraliza o texto
  },
  tipoUsuarioButtonSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#e0f2fe",
    borderWidth: 2,
  },
  tipoUsuarioText: {
    fontSize: 13, // Reduzido o tamanho da fonte
    color: "#444",
    fontWeight: "500",
    textAlign: 'center',
  },
  tipoUsuarioTextSelected: {
    color: "#1d4ed8",
    fontWeight: "bold",
  },
});