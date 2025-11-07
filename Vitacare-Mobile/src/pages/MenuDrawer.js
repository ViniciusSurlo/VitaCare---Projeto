import { createDrawerNavigator } from "@react-navigation/drawer";
import Landing from "./Landing";
import Login from "./Login";
import Medicamentos from "./Medicamentos";
import Consultas from "./Consultas"
import Cadastro from "./Cadastro";
import Perfil from "./Perfil";
import Historico from './Historico'
// import TelaInicial from "./TelaInicial"
import Introducao from "./Introducao";
import IACare from "./IACare";

const Drawer = createDrawerNavigator();

export default function MenuDrawer(){
    return(
        <Drawer.Navigator>
            <Drawer.Screen name="Introducao" component={Introducao} />
            <Drawer.Screen name="Login" component={Login} />
            <Drawer.Screen name="Cadastro" component={Cadastro} />
            <Drawer.Screen name="Landing" component={Landing} />
            <Drawer.Screen name="Medicamentos" component={Medicamentos} />
            <Drawer.Screen name='Consultas' component={Consultas} />
            <Drawer.Screen name='Perfil' component={Perfil} />
            <Drawer.Screen name='Historico' component={Historico} />
            <Drawer.Screen name='IACare' component={IACare} />
        </Drawer.Navigator>
    )
}
