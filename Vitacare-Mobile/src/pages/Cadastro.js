import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { enderecoServidor } from "../utils";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from "@expo/vector-icons";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoAcesso, setTipoAcesso] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroTipo, setErroTipo] = useState("");

  const botaoCadastro = async () => {
    let erro = false;
    setErroNome("");
    setErroEmail("");
    setErroSenha("");
    setErroTipo("");

    if (!nome) {
      setErroNome("Preencha o nome");
      erro = true;
    }
    if (!email) {
      setErroEmail("Preencha o email");
      erro = true;
    }
    if (!senha) {
      setErroSenha("Preencha a senha");
      erro = true;
    }
    if (!tipoAcesso) {
      setErroTipo("Selecione o tipo de acesso");
      erro = true;
    }
    if (erro) return;

    try {
      const resposta = await fetch(`${enderecoServidor}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          tipo_acesso: tipoAcesso,
          ativo: true,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("Cadastro realizado com sucesso!");
        navigation.navigate("Login");
      } else {
        throw new Error(dados.error || "Erro ao cadastrar");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.containerPrincipal}>
      <Image 
        source={require("../assets/cadastroCima.png")} 
        style={styles.imagemTopo}
        resizeMode="cover"
      /> 
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/corassaum.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Cadastro</Text>
        </View>

        <Text style={styles.subtitle}>
          Cadastre-se e cuide da{" "}
          <Text style={{ fontWeight: "bold" }}>sua saúde</Text> com a gente!
        </Text>

        {erroNome ? <Text style={styles.erro}>{erroNome}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={nome}
          onChangeText={setNome}
        />

        {erroEmail ? <Text style={styles.erro}>{erroEmail}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        

        {erroSenha ? <Text style={styles.erro}>{erroSenha}</Text> : null}
        <View style={styles.inputSenha}>
          <TextInput
            style={styles.inputTextSenha}
            placeholder="Senha"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Entypo
              name={mostrarSenha ? "eye" : "eye-with-line"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {erroTipo ? <Text style={styles.erro}>{erroTipo}</Text> : null}
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, gap: 8 }}>
          <Text style={{ marginLeft: 15, color: 'white', fontSize: 14, fontWeight: '600' }}>
            Qual o tipo de acesso?
          </Text>

          <View style={{ flexDirection: 'row', marginRight: 15}}>
            {["user", "admin", "comum"].map((tipo) => (
              <View key={tipo} style={{ alignItems: 'center', marginHorizontal: 5 }}>
                <TouchableOpacity
                  style={[
                    { width: 55, height: 55, backgroundColor: 'white', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
                    tipoAcesso === tipo && { opacity: 0.9, transform: [{ scale: 1.05 }] }
                  ]}
                  onPress={() => setTipoAcesso(tipo)}
                >
                  <MaterialIcons 
                    name={tipo === "user" ? "person" : tipo === "admin" ? "admin-panel-settings" : "group"} 
                    size={30} 
                    color="#0065FB" 
                  />
                </TouchableOpacity>
                <Text style={[
                  { color: 'white', marginTop: 5, fontSize: 12, fontWeight: '500' },
                  tipoAcesso === tipo && { fontWeight: 'bold' }
                ]}>
                  {tipo === "user" ? "Usuário" : tipo === "admin" ? "Admin" : "Comum"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.botao} onPress={botaoCadastro}>
          <Text style={styles.botaoTexto}>Cadastre-se</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: "#f1f1f1" }]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "black", fontSize: 16 }}>Entrar</Text>
            <View style={styles.iconCircleLight}>
              <Feather name="arrow-up-right" size={22} color="black" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: "#f1f1f1" }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "black", fontSize: 16 }}>Voltar</Text>
            <View style={styles.iconCircleBlue}>
              <Feather name="arrow-up-left" size={22} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: "#0065FB",
  },
  imagemTopo: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#0065FB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 14,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "white",
    fontSize: 16,
  },
  inputSenha: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputTextSenha: {
    color: "white",
    flex: 1,
    fontSize: 16,
  },
  labelTipo: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "500",
  },
  erro: {
    color: "#ffbaba",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  tipoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipoBox: {
    alignItems: "center",
  },
  tipoBoxInner: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 6,
  },
  tipoBoxSelecionado: {
    borderWidth: 2,
    borderColor: "#FFD700", 
    borderRadius: 12,
  },
  tipoTexto: {
    color: "#fff",
    fontSize: 14,
  },
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  botaoTexto: {
    color: "#0065FB",
    fontWeight: "bold",
    fontSize: 17,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "white",
    width: "40%",
    height: 55,
    marginHorizontal: 5,
  },
  iconCircleLight: {
    backgroundColor: "white",
    borderRadius: 25,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleBlue: {
    backgroundColor: "#0065FB",
    borderRadius: 25,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});