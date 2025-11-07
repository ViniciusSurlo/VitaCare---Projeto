import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Calendar from '../components/Calendar';
import moment from "moment";
import { StatusBar } from 'expo-status-bar';
import { enderecoServidor } from "../utils.js";

export default function Landing({ navigation, route }) {

  const { usuarioLogado } = route.params || {};
  const [usuario, setUsuario] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const [dadosDashboard, setDadosDashboard] = useState({
    medicamentos: [],
    consultas: [],
  });
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [allMedicamentos, setAllMedicamentos] = useState([]);

  //variaveis de estado para analise com IA
  const [mensagensIA, setMensagensIA] = useState([]);
  const [textoInputIA, setTextoInputIA] = useState("");
  const [carregandoAnalise, setCarregandoAnalise] = useState(false);
  const [modalAnaliseAberto, setModalAnaliseAberto] = useState(false);
  const scrollViewRef = useRef();

  // Perguntas sugeridas
  const perguntasSugeridas = [
    "Quais remédios devo tomar hoje?",
    "Tenho consultas agendadas?",
    "Há interação entre meus medicamentos?",
    "Como organizar melhor minha rotina?"
  ];

  const ModalAnaliseIA = () => (
    <View style={styles.modalOverlay}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          styles.modalContainer,
          Platform.OS === 'android' && keyboardHeight > 0 && {
            maxHeight: height - keyboardHeight - 40
          }
        ]}
        keyboardVerticalOffset={0}
      >
        {/* Header do Modal */}
        <View style={styles.modalHeader}>
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

          <TouchableOpacity
            onPress={() => {
              setModalAnaliseAberto(false);
              setMensagensIA([]);
              setTextoInputIA("");
            }}
            style={styles.btnFechar}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Área de mensagens */}
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
              <MaterialCommunityIcons name="robot-outline" size={80} color="#ccc" />
              <Text style={styles.textoVazio}>
                Olá! Sou sua assistente de saúde
              </Text>
              <Text style={styles.subtextoVazio}>
                Clique em "Gerar Análise" para uma análise completa dos seus dados ou faça uma pergunta específica
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

        {/* Guia de perguntas sugeridas */}
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

  // Função para gerar análise automática
  const gerarAnaliseAutomatica = async () => {
    setCarregandoAnalise(true);

    const mensagemSistema = {
      id: Date.now(),
      texto: "📊 Gerando análise completa dos seus dados...",
      tipo: "usuario",
    };
    setMensagensIA([mensagemSistema]);

    try {
      const resposta = await fetch(
        `${enderecoServidor}/medicamentos/buscarDados/${id_usuario}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dados = await resposta.json();
      setDadosDashboard(dados);

      const prompt = `
        Você é um consultor pessoal de saúde, especializado em orientar pacientes sobre o uso de medicamentos e consultas médicas.

        Receberá dois conjuntos de dados em formato JSON:
        1. Medicamentos – contendo nome, horário, dose e observações.
        2. Consultas – contendo especialidade, data, hora e local.

        Com base nessas informações, gere uma análise resumida e útil, com no máximo **150 palavras**, abordando:
        - Pontos de atenção (interações, horários próximos, possíveis esquecimentos).
        - Sugestões de rotina saudável para organizar remédios e consultas.
        - Lembretes práticos.
        - Um breve incentivo motivacional no final.

        Abaixo estão os dados do usuário:
        Medicamentos: ${JSON.stringify(dados.medicamentos)}
        Consultas: ${JSON.stringify(dados.consultas)}
      `;

      const apikey = "SAI_CURIOSO";

      const respostaIA = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apikey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.7,
          }),
        }
      );

      const dadosIA = await respostaIA.json();
     
      const respostaIAMensagem = {
        id: Date.now() + 1,
        texto: dadosIA.choices[0].message.content,
        tipo: "ia",
      };

      setMensagensIA((prev) => [...prev, respostaIAMensagem]);
    } catch (error) {
      console.error("Erro ao gerar análise com IA:", error);
      const erroMensagem = {
        id: Date.now() + 1,
        texto: "❌ Ocorreu um erro ao gerar a análise. Tente novamente.",
        tipo: "ia",
      };
      setMensagensIA((prev) => [...prev, erroMensagem]);
    } finally {
      setCarregandoAnalise(false);
    }
  };

  // Função para enviar pergunta específica
  const enviarPerguntaIA = async () => {
    if (!textoInputIA.trim()) return;

    const perguntaTexto = textoInputIA.trim();

    const novaMensagemUsuario = {
      id: Date.now(),
      texto: perguntaTexto,
      tipo: "usuario",
    };

    setMensagensIA((prev) => [...prev, novaMensagemUsuario]);
    setTextoInputIA("");
    setCarregandoAnalise(true);

    try {
      const resposta = await fetch(
        `${enderecoServidor}/medicamentos/buscarDados/${id_usuario}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      const dados = await resposta.json();

      const prompt = `
        Você é um consultor pessoal de saúde especializado. O ${usuario.nome} tem os seguintes dados:

        Medicamentos: ${JSON.stringify(dados.medicamentos)}
        Consultas: ${JSON.stringify(dados.consultas)}

        Pergunta do usuário: ${perguntaTexto}

        Responda de forma clara, objetiva e prestativa em no máximo 150 palavras.
      `;

      const apikey = "SAI_CURIOSO";

      const respostaIA = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apikey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.7,
          }),
        }
      );

      if (!respostaIA.ok) {
        const erroTexto = await respostaIA.text();
        console.error("Erro da API OpenAI:", erroTexto);
        throw new Error(`Erro da API: ${respostaIA.status}`);
      }

      const dadosIA = await respostaIA.json();
     
      const respostaIAMensagem = {
        id: Date.now() + 1,
        texto: dadosIA.choices[0].message.content,
        tipo: "ia",
      };

      setMensagensIA((prev) => [...prev, respostaIAMensagem]);
    } catch (error) {
      console.error("Erro ao enviar pergunta:", error);
      const erroMensagem = {
        id: Date.now() + 1,
        texto: `❌ Erro: ${error.message}. Verifique sua conexão e tente novamente.`,
        tipo: "ia",
      };
      setMensagensIA((prev) => [...prev, erroMensagem]);
    } finally {
      setCarregandoAnalise(false);
    }
  };

  const abrirModalIA = () => {
    setModalAnaliseAberto(true);
    setMensagensIA([]);
    setTextoInputIA("");
  };

  useEffect(() => {
  const carregarUsuario = async () => {
    try {
      const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
      if (usuarioJSON) {
        const usuario = JSON.parse(usuarioJSON);
        setUsuario(usuario);
        const id = usuario.id_usuario          
        setIdUsuario(id);
      }
    } catch (erro) {
      console.error("Erro ao carregar usuário logado:", erro);
    }
  };
  carregarUsuario();
}, []);

  // buscar medicamentos do usuário uma vez que o id esteja disponível
  useEffect(() => {
    const carregarMedicamentos = async () => {
      try {
        if (!id_usuario) return;
        const resposta = await fetch(`${enderecoServidor}/medicamentos/usuario/${id_usuario}`);
        if (!resposta.ok) {
          console.warn('Não foi possível buscar medicamentos:', resposta.status);
          return;
        }
        const dados = await resposta.json();
        setAllMedicamentos(Array.isArray(dados) ? dados : []);
      } catch (erro) {
        console.error('Erro ao carregar medicamentos:', erro);
      }
    };

    carregarMedicamentos();
  }, [id_usuario]);

  // retorna os medicamentos ativos para a data selecionada
  const getMedicamentosForDate = (date) => {
    if (!allMedicamentos || !allMedicamentos.length) return [];

    return allMedicamentos.filter((m) => {
      if (!m.ativo) return false;

      // alguns registros podem não ter data_fim
      const inicio = m.data_inicio; // yyyy-mm-dd
      const fim = m.data_fim;

      if (!inicio) return false;

      if (fim) {
        return moment(date).isBetween(inicio, fim, undefined, '[]');
      }

      // se não tem data_fim, considera como medicamento iniciado naquele dia (ou contínuo)
      return inicio === date || moment(date).isAfter(inicio);
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.headerUser}
              onPress={() => navigation.navigate("Perfil")}
            >
              <Image
                source={{
                  uri: "https://i.pinimg.com/736x/61/8f/b1/618fb1a8cf308ceea61c5d1545e5fd7a.jpg",
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.bomdia}>Bom dia,</Text>
                <Text style={styles.usuario}>{usuarioLogado.nome}.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notificacao}>
              <Ionicons name="notifications-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.pergunta}>Como você está se sentindo hoje?</Text>

          <View style={styles.opcoes}>
            {/* <TouchableOpacity style={styles.opcaoBtn}>
              <FontAwesome5 name="clipboard-check" size={18} color="#0049AB" />
              <Text style={styles.opcaoTxt}>Checkup</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.opcaoBtn} onPress={() => navigation.navigate('Medicamentos')}>
              <MaterialIcons
                name="health-and-safety"
                size={18}
                color="#0049AB"
              />
              <Text style={styles.opcaoTxt}>Remédios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcaoBtn} onPress={abrirModalIA}>
              <MaterialCommunityIcons name="robot" size={18} color="#0049AB" />
              <Text style={styles.opcaoTxt}>IA</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dias */}
        <View style={styles.container1}>
          <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
          <StatusBar style="auto" />
        </View>

        {/* Remédios do dia selecionado */}
        <View style={styles.remediosContainer}>
          <Text style={styles.remediosTitulo}>
            Remédios de {moment(selectedDate).format('DD [de] MMMM')}
          </Text>

          {getMedicamentosForDate(selectedDate).length > 0 ? (
            getMedicamentosForDate(selectedDate).map((r) => (
              <View key={r.id_medicamento} style={styles.remedioCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.remedioNome}>{r.nome}</Text>
                  <Text style={styles.remedioInfo}>{r.dosagem} • {r.horarios || 'Horários não informados'}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Medicamentos')}
                  style={styles.verMaisBtn}
                >
                  <Text style={styles.verMaisTxt}>Ver</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.semRemedios}>Nenhum remédio para esta data.</Text>
          )}
        </View>

        {/* Cards de Menu */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Medicamentos")}
          >
            <FontAwesome5 name="pills" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Remédios</Text>
            <Text style={styles.cardSub}>Veja aqui seus medicamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("IACare")}
          >
            <MaterialCommunityIcons name="robot" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>IACare</Text>
            <Text style={styles.cardSub}>Converse com a IA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Consultas")}
          >
            <MaterialIcons name="event-available" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Consultas</Text>
            <Text style={styles.cardSub}>Veja aqui suas consultas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Configuracoes')}>
            <Ionicons name="settings-outline" size={28} color="#0049AB" />
            <Text style={styles.cardTitle}>Configurações</Text>
            <Text style={styles.cardSub}>Veja aqui suas configurações</Text>
          </TouchableOpacity>
        </View>
       
        {modalAnaliseAberto && <ModalAnaliseIA />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  container1: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  /* HEADER */
  header: {
    backgroundColor: "#f4f4f4",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 20,
  },
  headerTop: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerUser: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  bomdia: { fontSize: 16, color: "#000" },
  usuario: { fontSize: 18, fontWeight: "bold", color: "#000" },
  notificacao: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  pergunta: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  opcoes: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    paddingHorizontal: 20,
  },
  opcaoBtn: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#ECECEC",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  opcaoTxt: { fontSize: 14, fontWeight: "500", color: "#000" },

  /* CARDS */
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
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10, color: "#000" },
  cardSub: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    marginTop: 4,
  },

  /* MODAL IA - ESTILO CHAT */
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "95%",
    maxHeight: "85%",
    shadowColor: "#000",
    marginTop: 100,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },

  /* HEADER DO MODAL */
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
  },
  statusTexto: {
    fontSize: 12,
    color: "#34C759",
  },
  btnFechar: {
    padding: 4,
  },

  /* ÁREA DE CHAT */
  chatArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  chatContent: {
    padding: 16,
  },
  mensagemVazia: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  textoVazio: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  subtextoVazio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  btnGerarAnalise: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 24,
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnGerarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mensagem: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  mensagemUsuario: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  mensagemIA: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textoMensagem: {
    fontSize: 15,
    color: "#000",
    lineHeight: 20,
  },
  textoMensagemUsuario: {
    color: "#fff",
  },
  carregandoContainer: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 4,
  },
  bolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    opacity: 0.4,
  },
  bolinha2: {
    opacity: 0.6,
  },
  bolinha3: {
    opacity: 0.8,
  },

  /* PERGUNTAS SUGERIDAS */
  perguntasContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 12,
  },
  perguntasContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  perguntaSugerida: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  perguntaSugeridaTexto: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "400",
  },

  /* INPUT */
  inputContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    maxHeight: 100,
    paddingVertical: 8,
  },
  btnEnviar: {
    marginLeft: 8,
    padding: 4,
  },
  remediosContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  remediosTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000'
  },
  remedioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7fb',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  remedioNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  remedioInfo: {
    fontSize: 13,
    color: '#666',
    marginTop: 4
  },
  verMaisBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  verMaisTxt: {
    color: '#fff',
    fontWeight: '600'
  },
  semRemedios: {
    color: '#888',
    fontSize: 14
  },
});