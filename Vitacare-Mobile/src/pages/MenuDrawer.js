import { createDrawerNavigator } from "@react-navigation/drawer";
import Landing from "./Landing";
import Login from "./Login";
import Medicamentos from "./Medicamentos";
import Consultas from "./Consultas"
import Cadastro from "./Cadastro";
// import TelaInicial from "./TelaInicial"
import Introducao from "./Introducao";

const Drawer = createDrawerNavigator();

export default function MenuDrawer(){
    return(
        <Drawer.Navigator>
            {/* <Drawer.Screen name="TelaInicial" component={TelaInicial} /> */}
            <Drawer.Screen name="Introducao" component={Introducao} />
            <Drawer.Screen name="Cadastro" component={Cadastro} />
            <Drawer.Screen name="Medicamentos" component={Medicamentos} />
            <Drawer.Screen name="Login" component={Login} />
            <Drawer.Screen name="Landing" component={Landing} />
            <Drawer.Screen name='Consultas' component={Consultas} />
        </Drawer.Navigator>
    )
}
