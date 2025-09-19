import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { enderecoServidor } from "../utils";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoAcesso, setTipoAcesso] = useState("admin");
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
          nome: nome,
          email: email,
          senha: senha,
          tipo_acesso: tipoAcesso,
          ativo: true,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("Cadastro realizado com sucesso!");
        navigation.navigate("Login");
        console.log("Cadastro realizado com sucesso:", dados);
      } else {
        console.log("Erro do backend:", dados);
        throw new Error(dados.error || "Erro ao cadastrar");
      }
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      alert(error.message);
      return;
    }
  };

  return (
    <View>
      <View
        className="flex justify-center items-center mt-6"
        style={{ marginTop: "150px" }}
      >
        <Image
          source={require("../assets/logo1.png")}
          style={{ height: "50px", width: "250px" }}
        />
        <Text className="text-black font-thin font-sans mt-6 mb-6">
          Cadastre-se e cuide da
          <Text className="font-bold text-blue-300"> sua saúde</Text> com a
          gente!
        </Text>
      </View>

      <View className='flex justify-center items-center'>
        {/* Nome */}
        <View className="mb-2">
            {erroNome ? (
              <Text className="text-red-500 text-xs mt-1">{erroNome}</Text>
            ) : null}
          <TextInput
            style={styles.inputView}
            placeholder="Nome"
            placeholderTextColor="#aaa"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        {/* Email */}
        <View className="mb-2">
            {erroEmail ? (
              <Text className="text-red-500 text-xs mt-1">{erroEmail}</Text>
            ) : null}
          <TextInput
            style={styles.inputView}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Senha */}
        <View style={styles.inputView}>
            {erroSenha ? (
              <Text className="text-red-500 text-xs mt-1">{erroSenha}</Text>
            ) : null}
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Entypo
              name={mostrarSenha ? "eye" : "eye-with-line"}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        {/* Tipo de acesso */}
        <View style={styles.inputView}>
            {erroTipo ? (
              <Text className="text-red-500 text-xs mt-1">{erroTipo}</Text>
            ) : null}
          <Picker
            selectedValue={tipoAcesso}
            onValueChange={(itemValue) => setTipoAcesso(itemValue)}
            style={{ color: "#1e293b" }}
            dropdownIconColor="#418cd3"
          >
            <Picker.Item
              label="Selecione o tipo de acesso"
              value=""
              color="#aaa"
            />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Usuário" value="user" />
          </Picker>
        </View>

        <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="mr-6 items-end font-sans font-bold"
        >
            <Text className="text-blue-300 text-lg underline">Voltar para Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-200 rounded-full py-3 mt-4 flex jutify-center items-center"
          style={{height:'45px', width:'150px'}}
          onPress={botaoCadastro}
        >
          <Text className="text-blue-600 font-thin text-lg flex items-center">Cadastre-se</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({ 
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
  }
})