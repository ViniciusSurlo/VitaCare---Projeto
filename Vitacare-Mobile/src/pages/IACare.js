import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function IACare({ navigation }) {
  const [mensagensIA, setMensagensIA] = useState([]);
  const [textoInputIA, setTextoInputIA] = useState("");
  const [carregandoAnalise, setCarregandoAnalise] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollViewRef = useRef();

  const perguntasSugeridas = [
    "Como está minha saúde geral?",
    "Preciso melhorar minha alimentação?",
    "Quais exercícios são ideais para mim?",
    "Analise meus sinais vitais",
  ];

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const gerarAnaliseAutomatica = () => {
    setCarregandoAnalise(true);
    setTimeout(() => {
      setMensagensIA([
        ...mensagensIA,
        { id: Date.now(), tipo: "ia", texto: "Sua saúde geral está estável, mas pode melhorar com mais hidratação e sono regular." },
      ]);
      setCarregandoAnalise(false);
    }, 2000);
  };

  const enviarPerguntaIA = () => {
    if (!textoInputIA.trim()) return;

    const novaMensagem = {
      id: Date.now(),
      tipo: "usuario",
      texto: textoInputIA,
    };

    setMensagensIA([...mensagensIA, novaMensagem]);
    setTextoInputIA("");
    setCarregandoAnalise(true);

    setTimeout(() => {
      setMensagensIA((prev) => [
        ...prev,
        { id: Date.now() + 1, tipo: "ia", texto: "Estou analisando suas informações..." },
      ]);
      setCarregandoAnalise(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="arrow-back" size={24} color="#1e1e1e" />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="robot" size={28} color="#007AFF" />
          </View>
          <View>
            <Text style={styles.modalTitulo}>Análise com IA</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusTexto}>Online</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Conteúdo principal */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          styles.contentContainer,
          Platform.OS === "android" && keyboardHeight > 0 && {
            maxHeight: height - keyboardHeight - 40,
          },
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        >
          {mensagensIA.length === 0 ? (
            <View style={styles.mensagemVazia}>
              <MaterialCommunityIcons
                name="robot-outline"
                size={80}
                color="#ccc"
              />
              <Text style={styles.textoVazio}>
                Olá! Sou sua assistente de saúde
              </Text>
              <Text style={styles.subtextoVazio}>
                Clique em "Gerar Análise" para uma análise completa dos seus
                dados ou faça uma pergunta específica
              </Text>
              <TouchableOpacity
                style={styles.btnGerarAnalise}
                onPress={gerarAnaliseAutomatica}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="auto-fix" size={20} color="#fff" />
                <Text style={styles.btnGerarTexto}>Gerar Análise</Text>
              </TouchableOpacity>
            </View>
          ) : (
            mensagensIA.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.mensagem,
                  msg.tipo === "usuario"
                    ? styles.mensagemUsuario
                    : styles.mensagemIA,
                ]}
              >
                <Text
                  style={[
                    styles.textoMensagem,
                    msg.tipo === "usuario" && styles.textoMensagemUsuario,
                  ]}
                >
                  {msg.texto}
                </Text>
              </View>
            ))
          )}

          {carregandoAnalise && (
            <View style={[styles.mensagem, styles.mensagemIA]}>
              <View style={styles.carregandoContainer}>
                <View style={styles.bolinha} />
                <View style={[styles.bolinha, styles.bolinha2]} />
                <View style={[styles.bolinha, styles.bolinha3]} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Perguntas sugeridas */}
        {mensagensIA.length === 0 && !carregandoAnalise && (
          <View style={styles.perguntasWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.perguntasContent}
            >
              {perguntasSugeridas.map((pergunta, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.perguntaSugerida}
                  onPress={() => setTextoInputIA(pergunta)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.perguntaSugeridaTexto}>{pergunta}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Faça uma pergunta sobre sua saúde..."
              placeholderTextColor="#999"
              value={textoInputIA}
              onChangeText={setTextoInputIA}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.btnEnviar,
                (!textoInputIA.trim() || carregandoAnalise) &&
                  styles.btnEnviarDisabled,
              ]}
              onPress={enviarPerguntaIA}
              disabled={!textoInputIA.trim() || carregandoAnalise}
              activeOpacity={0.7}
            >
              <Ionicons
                name="send"
                size={22}
                color={
                  textoInputIA.trim() && !carregandoAnalise ? "#007AFF" : "#ccc"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    backgroundColor: "#E6F0FF",
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    marginLeft: 10,
  },
  modalTitulo: { fontSize: 18, fontWeight: "bold", color: "#333" },
  statusContainer: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: "#4CD964",
    borderRadius: 4,
    marginRight: 5,
  },
  statusTexto: { color: "#4CD964", fontSize: 12 },
  contentContainer: { flex: 1 },
  chatArea: { flex: 1, paddingHorizontal: 16 },
  chatContent: { paddingVertical: 10 },
  mensagem: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
  },
  mensagemUsuario: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  mensagemIA: {
    backgroundColor: "#F1F1F1",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  textoMensagem: { fontSize: 15, color: "#333" },
  textoMensagemUsuario: { color: "#fff" },
  mensagemVazia: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  textoVazio: { fontSize: 18, fontWeight: "bold", color: "#444", marginTop: 10 },
  subtextoVazio: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
    marginVertical: 8,
  },
  btnGerarAnalise: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 12,
  },
  btnGerarTexto: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  perguntasWrapper: { marginVertical: 8 },
  perguntasContent: { paddingHorizontal: 10 },
  perguntaSugerida: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 8,
  },
  perguntaSugeridaTexto: { color: "#333", fontSize: 14 },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
    backgroundColor: "#fff",
  },
  inputWrapper: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
  },
  btnEnviar: { marginLeft: 10 },
  btnEnviarDisabled: { opacity: 0.5 },
  carregandoContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  bolinha: {
    width: 6,
    height: 6,
    backgroundColor: "#999",
    borderRadius: 3,
    opacity: 0.6,
  },
});
