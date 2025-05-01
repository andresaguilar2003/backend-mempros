import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, Dimensions } from 'react-native';
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

  // Auto scroll efecto carrusel
  useEffect(() => {
    if (todayTasks.length === 0) return;

    const interval = setInterval(() => {
      scrollIndex.current = (scrollIndex.current + 1) % todayTasks.length;
      flatListRef.current?.scrollToIndex({
        index: scrollIndex.current,
        animated: true,
      });
    }, 3000); // cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [todayTasks]);

  if (!todayTasks.length) return null;

  return (
    <View style={styles.bannerWrapper}>
      <Text style={styles.title}>🗓️ TAREAS DIARIAS</Text>
      <View style={styles.bannerContainer}>
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
      </View>
    </View>
  );
};

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
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
  },
});

export default TodayTasksBanner;
