import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Button } from 'react-native';
import { realtimeDb } from '../../../FirebaseConfig'; // Asegúrate de que esta línea esté correcta
import { ref, get, update, child } from 'firebase/database';

const TiempoReal = () => {
  const [datos, setDatos] = React.useState(null); // Inicializa con null
  const [nuevoStatus, setNuevoStatus] = React.useState(""); // Estado para el input de años

  React.useEffect(() => {
    const obtenerDatos = async () => {
      const dbRef = ref(realtimeDb); // Usa realtimeDb aquí
      try {
        const snapshot = await get(child(dbRef, "dispensador"));
        if (snapshot.exists()) {
          const datosObtenidos = snapshot.val();
          setDatos(datosObtenidos); // Actualiza el estado con los datos obtenidos
        } else {
          console.log("No se encontraron datos");
        }
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    // Llamada inicial para obtener datos
    obtenerDatos();

    // Configura el intervalo para obtener datos cada 3 segundos
    const intervalo = setInterval(() => {
      obtenerDatos();
    }, 3000);

    // Limpieza del intervalo cuando el componente se desmonte
    return () => clearInterval(intervalo);
  }, []); // El efecto se ejecutará una vez al montar el componente

  const manejarEnvioStatus = async () => {
    if (nuevoStatus.trim() === "") {
      console.log("El campo de status esta vacio");
      return;
    }

    const dbRef = ref(realtimeDb, "dispensador/disensador1"); // Usa realtimeDb aquí
    try {
      await update(dbRef, { status: nuevoStatus });
      console.log("Años actualizados exitosamente");
      setNuevoStatus(""); // Limpiar el campo de input después de enviar los datos
    } catch (error) {
      console.error("Error actualizando años:", error);
    }
  };

  return (
    <ScrollView>
      <View style={{ marginTop: 53, flex: 1 }}>
        {datos && (
          <>
            <Text>Status: {datos?.disensador1?.status} </Text>
          </>
        )}

        <View style={{ padding: 10 }}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
            placeholder="Ingrese nuevo año"
            value={nuevoStatus}
            onChangeText={setNuevoStatus}
          />
          <Button title="Actualizar Año" onPress={manejarEnvioStatus} />
        </View>
      </View>
    </ScrollView>
  );
};

export default TiempoReal;

const styles = StyleSheet.create({});
