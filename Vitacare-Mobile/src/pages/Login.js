import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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

      // Sempre salva os dados do usuário
      await AsyncStorage.setItem("UsuarioLogado", JSON.stringify({dados}));

      // se não quiser lembrar, marca um flag temporário
      if (!lembrar) {
        await AsyncStorage.setItem("NaoLembrar", "true");
      } else {
        await AsyncStorage.removeItem("NaoLembrar");
      }

      // Navega para Home passando os dados do usuário
      navigation.navigate("MainTabs", { 
        screen: "Home",
        params: { usuarioLogado: dados } 
      });
}
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert(error.message);
      return;
    }
  };

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("UsuarioLogado");
        const naoLembrar = await AsyncStorage.getItem("NaoLembrar");

        if (usuarioSalvo && !naoLembrar) {
          // 👉 em vez de MainTabs, leve direto pra Landing
          const dados = JSON.parse(usuarioSalvo);
        navigation.navigate("MainTabs", {
          screen: "Home",
          params: { usuarioLogado: dados },
        });
        } else {
          await AsyncStorage.removeItem("UsuarioLogado");
          await AsyncStorage.removeItem("NaoLembrar");
        }
      } catch (err) {
        console.error("Erro ao verificar login:", err);
      }
    };

    verificarLogin();
  }, []);

  return (
    <View style={styles.container}>
      
        <Image 
        source={require("../assets/loginCima.png")}
        style={styles.imagemTopo}
        resizeMode="cover"
        />
     

      <View style={styles.logincomp}>
        <Image source={require("../assets/logo1.png")} style={styles.logo} />
        <Text style={styles.subtitle}>
          O jeito <Text style={styles.inteligente}>inteligente</Text> de cuidar de você
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(0, 73, 171, 0.5)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.inputSenha}>
          <TextInput
            style={styles.inputTextSenha}
            placeholder="Senha"
            placeholderTextColor="rgba(0, 73, 171, 0.5)"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Entypo
              name={mostrarSenha ? "eye" : "eye-with-line"}
              size={22}
              color="#0049AB"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.lembrarContainer} 
          onPress={() => setLembrar(!lembrar)}
          value={lembrar}
        >
          <MaterialCommunityIcons 
            name={lembrar ? "checkbox-marked" : "checkbox-blank-outline"} 
            size={20} 
            color="#0049AB" 
          />
          <Text style={styles.lembrarText}>Lembrar de mim</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
        </TouchableOpacity>

        {/* Botões */}
      <View className="flex flex-row justify-center items-center">
        <TouchableOpacity
          className="border-4 flex flex-row border-white bg-gray-100 rounded-full w-40 h-12 justify-center items-center space-x-2"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-black text-lg font-sans">Voltar</Text>
          <View className="h-8 w-8 bg-white rounded-full flex justify-center items-center">
            <Feather name="arrow-up-left" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="border-4 flex flex-row border-white bg-gray-100 rounded-full w-40 h-12 justify-center items-center space-x-2"
          onPress={handleLogin} 
        >
          <Text className="text-black text-lg font-sans">Entrar</Text>
          <View className="h-8 w-8 bg-blue-600 rounded-full flex justify-center items-center">
            <Feather name="arrow-up-right" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>


      </View>

      <Image 
        source={require("../assets/logo1.png")} 
        style={styles.logoFooter} 
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  lembrarContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
  },
  lembrarText: {
  color: "#0049AB",
  fontSize: 14,
  marginLeft: 8,
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
  patternText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E8F0FF",
    letterSpacing: 8,
    marginBottom: -5,
  },
  logincomp: {
    width: "85%",
    alignItems: "center",
    marginTop: 120,
  },
  logo: {
    width: 280,
    height: 80,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  inteligente: {
    color: "#0049AB",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#0049AB",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#0049AB",
    fontSize: 16,
  },
  inputSenha: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#0049AB",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputTextSenha: {
    color: "#0049AB",
    flex: 1,
    fontSize: 16,
  },
  forgotPassword: {
    color: "#0049AB",
    fontSize: 13,
    alignSelf: "flex-end",
    marginTop: 5,
    marginBottom: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 15,
  },
  buttonVoltar: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonVoltarText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonEntrar: {
    flex: 1,
    backgroundColor: "#0049AB",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonEntrarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoFooter: {
    width: 120,
    height: 40,
    marginBottom: 20,
  },
});

export default Login;