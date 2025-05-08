import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";

import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from '@expo/vector-icons/AntDesign';
import { enderecoServidor } from "../utils";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo_usuario, setTipoUsuario] = useState("");
  const [ativo, setAtivo] = useState(true);
  const handleLogin = async () => {
    try {
      if (email === "" || senha === "") {
        throw new Error("Preencha todos os campos");
      }
      //autenticando utilizando a API de backend com o fetch e recebendo o token
      const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });
      const dados = await resposta.json();

      if (resposta.ok) {
        console.log("Login bem-sucedido:", dados);
        // Aqui você pode armazenar o token em um estado global ou AsyncStorage, se necessário
        AsyncStorage.setItem("UsuarioLogado", JSON.stringify(dados));
        navigation.navigate("Landing");
      } else {
        throw new Error(dados.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert(error.message);
      return;
    }
  };   
  

    return(
      <LinearGradient colors={["#C4D7FF", "#7495DB"]} style={styles.container}>
            <Image source={require("../assets/logo1.png")} style={styles.logo} />
            <Text style={styles.title}>Seja Bem-Vindo!</Text>
            <Text style={styles.subtitle}>
                O jeito inteligente de cuidar de você
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#aaa"
                value={senha}
                onChangeText={setSenha  }
                secureTextEntry
            />
            {/* <TextInput
                style={styles.input}
                placeholder="Tipo de Usuário"
                placeholderTextColor="#aaa"
                value={tipo_usuario}
                onChangeText={setTipoUsuario}
            /> */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar <AntDesign name="arrowright" size={24} color="black" /></Text>
            </TouchableOpacity>
        </LinearGradient>
    )
  }
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#0049ab",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    logo: {
      width: 350,
      height: 100,
      marginBottom: 20,
      borderRadius: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#000",
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#ffff",
      marginBottom: 30,
      textAlign: "center",
    },
    input: {
      width: "100%",
      backgroundColor: "#C4D7FF",
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
      color: "#f8fafc",
      fontSize: 16,
    },
    button: {
      backgroundColor: "#0049AB",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginBottom: 20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    footerText: {
      fontSize: 14,
      color: "#94a3b8",
      textAlign: "center",
      border: "1px solid #0049AB",
      padding: 10,
      borderRadius: 8,
      marginBottom: 15,
      textAlign: "center",
    },
    link: {
      color: "#2683ff",
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
    footer: {
      marginTop: 20,
      width: "100%",
      alignItems: "center",
    },
  });
  
export default Login;