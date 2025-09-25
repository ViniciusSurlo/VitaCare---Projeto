import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';


export default function Introducao() {
  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: "#f2f2f2", margin: 50}}>
      <View style={{marginTop: 100}}> 
      <Text className="font-thin text-3xl font-sans">
        Transforme sua saúde com a gente!
      </Text>

      {/* Imagem (deu certo iu rul) */}
      <Image
        source={require("../assets/corassaum.png")}
        style={{ height: 299, width: 299 }}
      />

      <Text className="text-center font-bold text-2xl">
        Seja bem vindo ao
        <Text className="text-blue-600 font-bold"> VitaCare </Text>
      </Text>

      {/* Botões */}
      <View className="flex flex-row justify-center items-center mt-4">
        <TouchableOpacity
          className="border-4 flex flex-row border-white bg-gray-100 rounded-full w-40 h-12 justify-center items-center space-x-2"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-black text-lg font-sans">Entrar</Text>
          <View className="h-8 w-8 bg-white rounded-full flex justify-center items-center">
            <Feather name="arrow-up-right" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="border-4 flex flex-row border-white bg-gray-100 rounded-full w-40 h-12 justify-center items-center space-x-2"
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text className="text-black text-lg font-sans">Cadastrar</Text>
          <View className="h-8 w-8 bg-blue-600 rounded-full flex justify-center items-center">
            <Feather name="arrow-up-right" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="justify-end flex flex-row items-center p-4 bg-gray-100 pt-10">
        <Image
          source={require("../assets/logo1.png")}
          style={{ width: 100, height: 20 }}
        />
      </View>
      </View>
    </View>
  );
}
