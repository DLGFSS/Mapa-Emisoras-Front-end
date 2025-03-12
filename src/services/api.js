import axios from 'axios';

const API_URL = 'http://127.0.0.1:45000'; 

export const getEstados = async () => {
  try {
    const response = await axios.get(`${API_URL}/geojson/mexico`);
    
    return response.data.features.map(feature => ({
      codigo: feature.properties.CODIGO,
      nombre: feature.properties.ESTADO
    }));
  } catch (error) {
    console.error('Error al obtener los estados:', error);
    return [];
  }
};

