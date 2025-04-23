import { onEachFeature , setGeoJson,getGeoJson,setStatesData } from './map.js'; 
import L from "leaflet";

var geojson

export function geojsonMexico(map) {
  return new Promise((resolve, reject) => {  
    let statesData = {};

    fetch('http://192.168.8.71:45000/geojson/mexico')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener el GeoJSON');
        }
        return response.json();
      })
      .then(res => {
        statesData = res;

        
        statesData.features.forEach(feature => {
          feature.properties.name = feature.properties.ESTADO;
        });
        setStatesData(statesData);

        if (typeof geojson !== 'undefined' && geojson !== null) {
          geojson.clearLayers();
        }

        const layer = L.geoJson(statesData, { onEachFeature }).addTo(map);
        setGeoJson(layer);

        resolve(statesData);  
      })
      .catch(error => {
        console.error("Error cargando el GeoJSON:", error);
        reject(error);  
      });
  });
}

  


  
export function geoJsonM(cve_ent, map) {
  const cve_ent_formatted = cve_ent.padStart(2, '0'); 

  // Retorna la promesa para que se pueda encadenar con then()
  return fetch(`http://192.168.8.71:45000/geojson/${cve_ent_formatted}/mun`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener el geojson");
      return response.json();
    })
    .then(statesData => {
      statesData.features.forEach(feature => {
        feature.properties.name = feature.properties.NOM_MUN;
      });

      const currentGeoJson = getGeoJson();
      if (currentGeoJson) {
        currentGeoJson.clearLayers();
      }

      const newLayer = L.geoJson(statesData, { onEachFeature }).addTo(map);
      setGeoJson(newLayer);

      // Devuelve el geojson para que pueda usarse después
      return statesData;
    })
    .catch(err => {
      console.error("Error al obtener el geojson:", err);
      throw err; // para propagar el error a quien llame
    });
}
export function geojsonMexicoAll(map) {
  return new Promise((resolve, reject) => {
    let statesData = {};

    fetch('http://192.168.8.71:45000/geojson/mexico/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener el GeoJSON de todos los municipios');
        }
        return response.json();
      })
      .then(res => {
        statesData = res;

        // Agrega el nombre visible del municipio
        statesData.features.forEach(feature => {
          feature.properties.name = feature.properties.NOM_MUN;
        });

        // Guarda los datos
        setStatesData(statesData);

        // Limpia capa anterior si existe
        if (typeof geojson !== 'undefined' && geojson !== null) {
          geojson.clearLayers();
        }

        const layer = L.geoJson(statesData, { onEachFeature }).addTo(map);
        setGeoJson(layer);

        resolve(statesData);
      })
      .catch(error => {
        console.error("Error cargando el GeoJSON:", error);
        reject(error);
      });
  });
}
