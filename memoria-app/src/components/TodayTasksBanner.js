import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const TodayTasksBanner = () => {
  const { token } = useContext(AuthContext);
  const [todayTasks, setTodayTasks] = useState([]);
  const flatListRef = useRef(null);
  const scrollIndex = useRef(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://192.168.1.19:5000/api/tasks/today', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTodayTasks(data);
      } catch (error) {
        console.error('❌ Error al obtener tareas:', error);
      }
    };

    fetchTasks();
  }, [token]);

  useEffect(() => {
    if (todayTasks.length <= 1) return; // no hace falta auto-scroll si hay 0 o 1 tareas

    const interval = setInterval(() => {
      scrollIndex.current = (scrollIndex.current + 1) % todayTasks.length;
      flatListRef.current?.scrollToIndex({
        index: scrollIndex.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [todayTasks]);

  return (
    <View style={styles.bannerWrapper}>
      <Text style={styles.title}>🗓️ TAREAS DIARIAS</Text>
      <View style={styles.bannerContainer}>
        {todayTasks.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={todayTasks}
            horizontal
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskTime}>⏰ {item.time}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        ) : (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>🎉 No hay tareas para hoy</Text>
            <Text style={styles.taskTime}>Tómate un descanso o crea una nueva</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TodayTasksBanner;

const styles = StyleSheet.create({
  bannerWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff9900',
  },
  bannerContainer: {
    height: 120,
    width: '100%',
  },
  taskCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: width * 0.7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
