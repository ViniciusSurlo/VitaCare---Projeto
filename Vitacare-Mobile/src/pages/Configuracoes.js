import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ImageBackground } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Removida a importação de LinearGradient, pois usaremos ImageBackground

export default function Configuracoes() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState("");
  const [id_usuario, setIdUsuario] = useState("");

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("UsuarioLogado");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);
          setUsuario(usuario);
          setIdUsuario(usuario.id_usuario);
          console.log('dados:', usuario);
          
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário logado:", erro);
      }
    };

    carregarUsuario();
  }, [])

  return (
    <ScrollView style={styles.container}>
    
      {/* 1. USANDO O ESTILO DEFINIDO NO STYLESHEET AGORA */}
      <ImageBackground
        source={require('../assets/gradient.jpg')} 
        style={styles.headerBackground} 
        resizeMode="cover"
      >
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>😎</Text>
          </View>
          <Text style={styles.userName}>{usuario.nome}</Text>
        </View>
      </ImageBackground>


      {/* Container das Opções do Menu */}
      <View style={styles.menuContainer}>

        {/* Botão Meu Perfil (Padrão) */}
        <TouchableOpacity
          style={[styles.menuButton, styles.menuButtonStandard]}
          onPress={() => navigation.navigate('Perfil')}
        >
          <View style={styles.iconBackground}>
            <FontAwesome name="user" size={22} color="#444" />
          </View>
          <Text style={styles.menuText}>Meu Perfil</Text>
        </TouchableOpacity>

        {/* Botão de Notificações (Destacado) */}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate("Notificacoes")}
        >
          {/* 3. SUBSTITUÍDO LINEARGRADIENT POR IMAGEBACKGROUND */}
          <ImageBackground
            source={require('../assets/gradient.jpg')} // <--- USANDO A MESMA IMAGEM
            style={styles.menuButtonHighlighted}
            resizeMode="contain"
          >
            <Ionicons name="notifications" size={24} color="white" style={styles.menuIcon} />
            <Text style={styles.menuTextHighlighted}>Notificações</Text>
            {/* Badge de Notificação */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Botão Histórico de Consultas (Padrão) */}
        <TouchableOpacity
          style={[styles.menuButton, styles.menuButtonStandard]}
          onPress={() => navigation.navigate('Historico')}
        >
          <View style={styles.iconBackground}>
            <MaterialIcons name="history" size={24} color="#444" />
          </View>
          <Text style={styles.menuText}>Histórico de Consultas</Text>
        </TouchableOpacity>

        {/* Botão Ajuda (Padrão) - Adicionado da imagem */}
        <TouchableOpacity
          style={[styles.menuButton, styles.menuButtonStandard]}
          onPress={() => { /* Navegar para a tela de Ajuda, se existir */ }}
        >
          <View style={styles.iconBackground}>
            <Ionicons name="help-circle" size={24} color="#444" />
          </View>
          <Text style={styles.menuText}>Ajuda</Text>
        </TouchableOpacity>

        {/* Botão SAIR */}
        <TouchableOpacity
          style={[styles.menuButton, styles.menuButtonStandard]}
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("UsuarioLogado"); // remove o usuário salvo
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // garante que o stack seja reiniciado na tela de login
              });
            } catch (error) {
              console.error("Erro ao deslogar:", error);
            }
          }}
        >
          <View style={styles.iconBackground}>
            <Ionicons name="log-out" size={24} color="#444" />
          </View>
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

// Estilos completamente novos baseados na imagem
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Um fundo levemente cinza
  },
  
  /* NOVO ESTILO PARA O IMAGEBACKGROUND */
  headerBackground: {
    height: 154,
    width: 352,
    marginHorizontal: 20, /* Para dar espaço nas laterais */
    marginTop: 20,
    borderRadius: 16, /* <--- BORDAS ARREDONDADAS AQUI */
    overflow: 'hidden', /* <--- ESSENCIAL PARA CORTAR A IMAGEM */
  },
  
  /* NOVO ESTILO PARA ALINHAR O CONTEÚDO DENTRO DO IMAGEBACKGROUND */
  headerContent: {
    padding: 20,
    paddingTop: 40, /* Ajustado o padding superior */
    flexDirection: 'row',
    alignItems: 'center',
    // Opcional: Adicionar um leve sombreamento ou overlay aqui se necessário
  },
  
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#005fba',
    fontWeight: 'bold',
    fontSize: 22,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 20, /* Ajuste para ter um pequeno espaço após o cabeçalho */
  },
  menuButton: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden', // <--- ESSENCIAL PARA CORTAR O IMAGEBACKGROUND DO BOTÃO
    // Sombra para dar elevação
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  menuButtonStandard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  menuButtonHighlighted: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuTextHighlighted: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    flex: 1, // Faz o texto ocupar o espaço e empurra o badge para a direita
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white', // Mudei para branco, como na imagem de referência
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#005fba', // Cor do texto do badge para contrastar com o branco
    fontWeight: 'bold',
    fontSize: 12,
  },
});