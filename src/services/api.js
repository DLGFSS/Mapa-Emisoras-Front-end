const API_URL = "http://192.168.8.71:45000";


// Obtener municipios por estado
export async function getMunicipios(cve_ent) {
  try {
    const response = await fetch(`${API_URL}/${cve_ent}/mun`);
    if (!response.ok) throw new Error("Error al obtener municipios");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchMunicipios:", error);
    return [];
  }
}

// Obtener geojson de México

export const getEstados = async () => {
    try {
      const response = await fetch(`${API_URL}/geojson/mexico`);
      if (!response.ok) {
        throw new Error("Error al realizar la petición: " + response.statusText);
      }
      const data = await response.json();
  
      return data.features.map(feature => ({
        codigo: feature.properties.CODIGO,
        nombre: feature.properties.ESTADO
      }));
    } catch (error) {
      console.error("Error al obtener los estados:", error);
      return [];
    }
  };

//optenemos las sustancias 
  export const getSustancias = async () => {
    try {
      const response = await fetch(`${API_URL}/sustancias`);
      if (!response.ok) {
        throw new Error("Error al obtener sustancias");
      }
      const data = await response.json();
      
      return data.map(item => ({
        cas: item.cas,
        name: item.name
      }));
    } catch (error) {
      console.error("Error al obtener las sustancias:", error);
      return [];
    }
  };
  