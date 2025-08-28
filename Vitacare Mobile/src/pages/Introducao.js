import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";


export default function Introducao() {
    const navigate = useNavigation()

    const [fontsLoaded] = useFonts({
    Raleway: require("./assets/fonts/Raleway-Regular.ttf"),
    RalewayBold: require("./assets/fonts/Raleway-Bold.ttf"),
  });

  if (!fontsLoaded) return null;
  
  return (
    <View>
      <Text>Transforme sua saúde com a gente!</Text>
      <Image className='h-6 w-6 flex justify-center' source={require("../assets/corassaum.png")}/>
      {/* botao pra ir pra login */}
      <TouchableOpacity >

      </TouchableOpacity>
    </View>
  );
}

