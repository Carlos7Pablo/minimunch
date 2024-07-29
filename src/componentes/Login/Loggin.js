import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

function Loggin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Usa useNavigation para obtener el objeto de navegación

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
      navigation.navigate('Navegador2'); // Navega a la pantalla de inicio después de iniciar sesión
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minimunch</Text>
      <Text style={styles.subTitulo}>Inicia sesión en tu cuenta</Text>
      <View style={styles.container2}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
          placeholder="correo@direccion.com"
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
          placeholder="Contraseña"
          secureTextEntry
        />
      </View>
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F4E1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  container2: {
    alignItems: 'center',
  },
  titulo: {
    marginTop: 150,
    fontSize: 45,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitulo: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    color: 'black',
    marginBottom: 30,
  },
  textInput: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: 'black',
    backgroundColor: '#F8F4E1',
  },
  button: {
    marginLeft: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#AF8F6F',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Loggin;
