import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Switch } from 'react-native';
import { ref, update, onValue } from 'firebase/database';
import { realtimeDb } from '../../../FirebaseConfig'; 

const Datos = () => {
  const [dispensadorData, setDispensadorData] = useState({});
  const [porpeso, setPorpeso] = useState(false);
  const [porprox, setPorprox] = useState(false);

  useEffect(() => {
    const statusRef = ref(realtimeDb, 'dispensador');

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDispensadorData(data);
        setPorpeso(data.porpeso === 1);
        setPorprox(data.porprox === 1);
      } else {
        setDispensadorData({});
        setPorpeso(false);
        setPorprox(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleSwitch = async (field, value) => {
    try {
      await update(ref(realtimeDb, 'dispensador'), { [field]: value ? 1 : 0 });
      console.log(`Actualizado ${field} a ${value ? 1 : 0}`);
    } catch (error) {
      console.error(`Error actualizando ${field}:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Image
          source={require('../TiempoReal/dispensador.jpg')}
          style={styles.image}
        />
        <Text style={styles.title}>Minimunch</Text>
        <Text style={styles.info}>Modelo: Minimuch</Text>
        <Text style={styles.info}>Cantidad Máxima de Comida: 5 kg</Text>
        <Text style={styles.info}>
          Cantidad de comida actual: {dispensadorData.status?.weight ? (dispensadorData.status.weight / 1000).toFixed(2) + ' kg' : 'Cargando...'}
        </Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Prender sensor de peso:</Text>
          <Switch
            value={porpeso}
            onValueChange={(value) => {
              setPorpeso(value);
              handleToggleSwitch('porpeso', value);
            }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Prender sensor de distancia:</Text>
          <Switch
            value={porprox}
            onValueChange={(value) => {
              setPorprox(value);
              handleToggleSwitch('porprox', value);
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F4E1', // Fondo de la pantalla
  },
  dataContainer: {
    marginTop: 120,
    backgroundColor: '#AF8F6F',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  info: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
  },
});

export default Datos;
