import axios from 'axios';

// URL base igual a la de tus logros
const API = 'https://backend-mempros.onrender.com/api/pmcq';

// Puedes recibir el token desde el contexto o como parámetro si hace falta
export const checkIfPMCQCompleted = async (token) => {
  try {
    const res = await axios.get(`${API}/result`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ PMCQ completado:', res.data);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log('ℹ️ PMCQ aún no completado');
      return null;
    }
    console.error('❌ Error al comprobar PMCQ:', err.message);
    throw err;
  }
};

export const submitPMCQ = async (data, token) => {
  const res = await axios.post(`${API}/submit`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
