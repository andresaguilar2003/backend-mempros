import { createContext, useContext, useEffect, useState } from 'react';
import { checkIfPMCQCompleted } from '../utils/pmcqService';
import { useAuth } from './AuthContext';
import axios from 'axios';

const PMCQContext = createContext();

export const usePMCQ = () => useContext(PMCQContext);

export const PMCQProvider = ({ children }) => {
  const [hasCompletedPMCQ, setHasCompletedPMCQ] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      if (!token) return;

      try {
        const result = await checkIfPMCQCompleted(token);
        setHasCompletedPMCQ(!!result);
      } catch (err) {
        console.error('❌ Error al verificar estado del PMCQ:', err.message);
      }
    };

    fetchStatus();
  }, [token]);

  const submitPMCQ = async (data) => {
    try {
        const response = await axios.post(
            'http://192.168.1.19:5000/api/pmcq/submit', // ← CORREGIDO
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      setHasCompletedPMCQ(true);
      return response.data;
    } catch (err) {
      console.error('❌ Error al enviar PMCQ:', err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <PMCQContext.Provider value={{ hasCompletedPMCQ, setHasCompletedPMCQ, submitPMCQ }}>
      {children}
    </PMCQContext.Provider>
  );
};
