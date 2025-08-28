import { createDrawerNavigator } from "@react-navigation/drawer";
import Landing from "./Landing";
import Login from "./Login";
import TelaInicial from "./TelaInicial";

const Drawer = createDrawerNavigator();

export default function MenuDrawer(){
    return(
        <Drawer.Navigator>
            <Drawer.Screen name="TelaInicial" component={TelaInicial} />
            <Drawer.Screen name="Login" component={Login} />
            <Drawer.Screen name="Landing" component={Landing} />
            
        </Drawer.Navigator>
    )
}
