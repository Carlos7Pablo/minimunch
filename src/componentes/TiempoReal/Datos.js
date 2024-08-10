import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ref, update, onValue } from 'firebase/database';
import { realtimeDb } from '../../../FirebaseConfig'; 

const Datos = () => {
  const [dispensadorData, setDispensadorData] = useState({});
  const [porpeso, setPorpeso] = useState(false);
  const [porprox, setPorprox] = useState(false);
  const [status, setStatus] = useState('Desactivado'); // Estado para 'status'

  useEffect(() => {
    const statusRef = ref(realtimeDb, 'dispensador');

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDispensadorData(data);
        setPorpeso(data.porpeso === 1);
        setPorprox(data.porprox === 1);
        setStatus(data.status?.last_action || 'Desactivado'); // Obtiene el estado del dispensador
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleSwitch = async (field, value) => {
    try {
      await update(ref(realtimeDb, 'dispensador'), { [field]: value ? 1 : 0 });
    } catch (error) {
      console.error(`Error actualizando ${field}:`, error);
    }
  };

  const handleManualActivation = async (newStatus) => {
    const newLastAction = `Dispensador ${newStatus}`;
    try {
      await update(ref(realtimeDb, 'dispensador/status'), {
        last_action: newLastAction, // Actualiza el campo last_action en status
      });
      setStatus(newStatus); // Actualiza el estado local del status
    } catch (error) {
      console.error(`Error activando manualmente el dispensador:`, error);
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

        {/* Sección para mostrar el estado del dispensador */}
        <View style={styles.statusContainer}>
          <Text style={styles.switchLabel}>Estado del Dispensador:</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {/* Botones de Activación y Desactivación Manual */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.activateButton}
            onPress={() => handleManualActivation('Activado')}
          >
            <Text style={styles.buttonText}>Activar Dispensador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deactivateButton}
            onPress={() => handleManualActivation('Desactivado')}
          >
            <Text style={styles.buttonText}>Desactivar Dispensador</Text>
          </TouchableOpacity>
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
  statusContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  activateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50', // Verde para Activar
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deactivateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F44336', // Rojo para Desactivar
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Datos;
