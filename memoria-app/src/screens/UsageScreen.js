import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { useAuth } from '../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function UsageScreen() {
  const { user, token } = useAuth();
  const [minutesUsed, setMinutesUsed] = useState(0);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('http://192.168.1.19:5000/api/usage/get', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setMinutesUsed(data.minutesUsed || 0);
      } catch (error) {
        console.error('Error al obtener uso:', error);
      }
    };

    fetchUsage();
  }, [token]);

  const percentage = Math.min(minutesUsed / 30, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tiempo de uso diario</Text>
      <ProgressChart
        data={{
          labels: ['Uso'], 
          data: [percentage],
        }}
        width={screenWidth - 40}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => 
            minutesUsed >= 30 
              ? `rgba(255, 0, 0, ${opacity})` // rojo si excede
              : `rgba(0, 122, 255, ${opacity})`, // azul normal
        }}
        
        hideLegend={false}
      />
      <Text style={styles.minutesText}>{minutesUsed} / 30 minutos usados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  minutesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
