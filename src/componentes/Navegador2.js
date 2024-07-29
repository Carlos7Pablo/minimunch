import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Datos from './TiempoReal/Datos';
import Horarios from './Horarios/Horarios';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Datos"
      screenOptions={{
        tabBarActiveTintColor: '#AF8F6F',
        headerShown: false, 
      }}
    >
      <Tab.Screen
        name="Datos"
        component={Datos}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons name="home" size={size} color={'#543310'} />
          ),
        }}
      />
      <Tab.Screen
        name="Horarios"
        component={Horarios}
        options={{
          tabBarIcon: ({size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={'#543310'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MyTabs}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

export default function Navegador2() {
  return (
    <MyStack />
  );
}
