import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { realtimeDb } from '../../../FirebaseConfig'; 

const Horarios = () => {
  const [schedules, setSchedules] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);

  useEffect(() => {
    const schedulesRef = ref(realtimeDb, 'schedules');

    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const scheduleList = snapshot.val();
      if (scheduleList) {
        setSchedules(Object.entries(scheduleList).map(([key, data]) => ({ key, ...data })));
      } else {
        setSchedules([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const formatDate = (input) => {
    let formatted = input.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    if (formatted.length > 5) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5, 9)}`;
    }
    return formatted.slice(0, 10); 
  };

  const formatTime = (input) => {
    let formatted = input.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}:${formatted.slice(2)}`;
    }
    return formatted.slice(0, 5); 
  };

  const handleDateChange = (text) => {
    const formatted = formatDate(text);
    setDate(formatted);
  };

  const handleTimeChange = (text) => {
    const formatted = formatTime(text);
    setTime(formatted);
  };

  const handleAddOrUpdateSchedule = async () => {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    const timePattern = /^\d{2}:\d{2}$/;
    
    if (!datePattern.test(date)) {
      Alert.alert('Error', 'Fecha debe estar en formato DD/MM/YYYY');
      return;
    }

    if (!timePattern.test(time)) {
      Alert.alert('Error', 'Hora debe estar en formato HH:MM');
      return;
    }

    try {
      if (isEditing) {
        const scheduleRef = ref(realtimeDb, `schedules/${currentKey}`);
        await update(scheduleRef, { name, date, time });
        setIsEditing(false);
        setCurrentKey(null);
      } else {
        const schedulesRef = ref(realtimeDb, 'schedules');
        await push(schedulesRef, { name, date, time });
      }

      setName('');
      setDate('');
      setTime('');
    } catch (error) {
      console.error('Error adding/updating schedule: ', error);
      Alert.alert('Error', 'Error adding/updating schedule: ' + error.message);
    }
  };

  const handleEdit = (key) => {
    const schedule = schedules.find((sched) => sched.key === key);
    setName(schedule.name);
    setDate(schedule.date);
    setTime(schedule.time);
    setIsEditing(true);
    setCurrentKey(key);
  };

  const handleDelete = async (key) => {
    try {
      const scheduleRef = ref(realtimeDb, `schedules/${key}`);
      await remove(scheduleRef);
    } catch (error) {
      console.error('Error deleting schedule: ', error);
      Alert.alert('Error', 'Error deleting schedule: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horarios del Dispensador de Comida</Text>
      <TextInput
        placeholder="Nombre del Horario"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha (DD/MM/YYYY)"
        value={date}
        onChangeText={handleDateChange}
        style={styles.input}
        keyboardType="numeric"
        maxLength={10} 
      />
      <TextInput
        placeholder="Hora (HH:MM)"
        value={time}
        onChangeText={handleTimeChange}
        style={styles.input}
        keyboardType="numeric"
        maxLength={5} 
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleAddOrUpdateSchedule}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Actualizar' : 'Agregar'}</Text>
      </TouchableOpacity>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleText}>
              <Text style={styles.scheduleName}>{item.name}</Text>
              <Text>{item.date} {item.time}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit(item.key)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.key)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F4E1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    marginTop:100,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#74512D',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#74512D',
    marginBottom: 10,
    borderRadius: 5,
  },
  scheduleText: {
    flex: 1,
  },
  scheduleName: {
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
    backgroundColor: '#66BB6A',
    borderRadius: 5,
    width: 65,
    alignItems: 'center',
    marginTop: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#EF5350',
    borderRadius: 5,
    width: 65,
    alignItems: 'center',
    marginTop: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#74512D',
    marginTop: 20,
    marginLeft: '25%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Horarios;
