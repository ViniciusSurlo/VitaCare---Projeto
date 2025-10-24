import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Login from "./src/pages/Login";
import Landing from "./src/pages/Landing";
import Introducao from "./src/pages/Introducao";
import Medicamentos from "./src/pages/Medicamentos";
import Consultas from "./src/pages/Consultas";
import Cadastro from "./src/pages/Cadastro";
import Configuracoes from "./src/pages/Configuracoes"; // <-- se ainda não existir, crie essa tela
import Perfil from "./src/pages/Perfil";

import "./global.css";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🚀 Tabs principais
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Consultas") iconName = "calendar-outline";
          else if (route.name === "Medicamentos") iconName = "medkit-outline";
          else if (route.name === "Configuracoes") iconName = "settings-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2683ff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 5,
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={Landing} />
      <Tab.Screen name="Consultas" component={Consultas} />
      <Tab.Screen name="Medicamentos" component={Medicamentos} />
      <Tab.Screen name="Configuracoes" component={Configuracoes} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Introducao"
          component={Introducao}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name='Perfil'
          component={Perfil}
          options={{ headerShown: false }}
        />

        {/* 🔑 Quando logar, usuário vai para o Tab Navigator */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
