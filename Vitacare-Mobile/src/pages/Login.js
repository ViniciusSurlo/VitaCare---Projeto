import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";

import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import { enderecoServidor } from "../utils";
import { Alert } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Entypo from "@expo/vector-icons/Entypo";
import { Video } from "expo-av";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("borba@gmail.com");
  const [senha, setSenha] = useState("123");
  const [tipo_usuario, setTipoUsuario] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);  

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
      console.log("DADOS COMPLETOS", dados);

      if (resposta.ok) {
        console.log("Login bem-sucedido:", dados);
        // Aqui você pode armazenar o token em um estado global ou AsyncStorage, se necessário
        AsyncStorage.setItem("UsuarioLogado", JSON.stringify(dados));
        navigation.navigate("MainTabs", { screen: "Home" });
      } else {
        throw new Error(dados.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert(error.message);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={{ position: "absolute", top: 70, left: 30, zIndex: 10 }}
        onPress={() => navigation.goBack()}
        >
        <MaterialCommunityIcons name="arrow-left" size={34} color="" />
      </TouchableOpacity>

      
      {/* <Text className='absolute top-8 left-6 z-10' onClick={() => navigation.goBack()}><MaterialCommunityIcons name='arrow-left' size={34} /></Text> */}
      {/* LOGIN */}
      <View style={styles.logincomp}>
        <Image source={require("../assets/logo1.png")} style={styles.logo} />
        <Text style={styles.subtitle}>
          O jeito <Text className="text-blue-800">inteligente</Text> de cuidar
          de você
        </Text>
        {/* email */}
        <View style={styles.inputView} className="flex-row items-center">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            className="flex-1 justify-center text-lg items-center"
          />
          <MaterialCommunityIcons
            name="email"
            size={24}
            color="#aaa"
            className="text-center items-center justify-center"
          />
        </View>
        {/* senha */}
        <View style={styles.inputView} className="flex-row items-center">
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            className="flex-1 justify-center text-lg"
          />

          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Entypo
            name={mostrarSenha ? "eye" : "eye-with-line"}
            size={24}
            color="#aaa"
            className="text-center items-center justify-center"
          />
          </TouchableOpacity>
        </View>
        {/* <TextInput
                style={styles.input}
                placeholder="Tipo de Usuário"
                placeholderTextColor="#aaa"
                value={tipo_usuario}
                onChangeText={setTipoUsuario}
            /> */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.buttonText2}> Cadastre-se </Text>
        </TouchableOpacity>
      </View>
      {/* FIM */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 350,
    height: 100,
    borderRadius: 10,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputView: {
    width: 350,
    height: 50,
    backgroundColor: "#ffff",
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#C9C9C9",
    borderWidth: 2.8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#0049AB",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button2: {
    backgroundColor: "#BED0FF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText2: {
    color: "#0049AB",
    fontSize: 18,
    fontWeight: "thin",
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
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  circuloFundo: {
    position: "absolute",
    top: "20%",
    left: 0,
    transform: [{ scale: 1.1 }],
  },
  logincomp: {
    transform: [{ scale: 1 }],
  },
});

export default Login;
