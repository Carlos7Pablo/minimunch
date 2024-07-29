import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './Register/Register'
import Loggin from './Login/Loggin'
import Navegador2 from './Navegador2'

const Stack = createStackNavigator();

export default function Navegador() {
  return (
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Crea tu cuenta" component={Register} />
        <Stack.Screen name="Loggin" component={Loggin} />
        <Stack.Screen name="Navegador2" component={Navegador2} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
