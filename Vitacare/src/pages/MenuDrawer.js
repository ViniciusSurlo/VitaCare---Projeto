import { createDrawerNavigator } from "@react-navigation/drawer";
import Landing from "./Landing";

const Drawer = createDrawerNavigator();

export default function MenuDrawer(){
    return(
        <Drawer.Navigator>
            <Drawer.Screen name="Landing" component={Landing} />
        </Drawer.Navigator>
    )
}
