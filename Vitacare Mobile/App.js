import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./src/pages/Login";
import Landing from "./src/pages/Landing";
import Introducao from "./src/pages/Introducao";
import "./global.css"

const stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Introducao" component={Introducao} options={{headerShown: false}} />
        <stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <stack.Screen name="Landing" component={Landing} options={{headerShown: false}} />
      </stack.Navigator>
    </NavigationContainer>
  )
}