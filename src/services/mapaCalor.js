import { onEachFeature, setGeoJson, getStatesData, style ,setStatesData } from './map.js';
import L from 'leaflet';
import { geojsonMexico } from './geojson.js';

setStatesData(geojsonMexico);
export function release_ent(map, cve_ent, sustancia, year) {
    const data = {
        "cve_ent": cve_ent.toString().padStart(2, "0"), // para que sea '02' y no '2'
        "cas": sustancia,
        "year": year
    };

    console.log("se hizo click en release ENT", data);

    fetch("http://127.0.0.1:45000/release/ent/mun", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        const dataMap = {};
        const statesData = getStatesData();

        data.forEach(item => {
            dataMap[item.municipio_cve_mun] = { index: item.index_risk, info: item.info };
        });

        statesData.features.forEach(f => {
            const clave = f.properties.CVE_MUN;
            const entry = dataMap[clave] || { index: 0, info: 0 };
            f.properties.density = entry.index;
            f.properties.info = entry.info;
        });

        const geojson = L.geoJson(statesData, { style, onEachFeature }).addTo(map);
        setGeoJson(geojson);
    })
    .catch(err => console.error("Error al cargar release_ent:", err));
}

export function release_all_mun(map, sustancia, year) {
    const data = { 
                "cas": sustancia, 
                "year": year 
                };

    console.log("se hizo click en release ALL", data);

    fetch("http://127.0.0.1:45000/release/all", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        const dataMap = {};
        const statesData = getStatesData();

        data.forEach(item => {
            dataMap[parseInt(item.municipio_cve_mun)] = { index: item.index_risk, info: item.info };
        });

        statesData.features.forEach(f => {
            const clave = f.properties.CVE_MUN;
            const entry = dataMap[clave] || { index: 0, info: 0 };
            f.properties.density = entry.index;
            f.properties.info = entry.info;
        });

        const geojson = L.geoJson(statesData, { style, onEachFeature }).addTo(map);
        setGeoJson(geojson);
    })
    .catch(err => console.error("Error al cargar release_all_mun:", err));
}

export function release_ent_mex(map, sustancia, year) {
    const data = { 
      "cas": sustancia,     
      "year": year 
    };
  
    console.log("se hizo click en release ENT MEX", data);
  
    geojsonMexico(map)  // Esperamos a que el geojson esté listo
      .then(() => {
        // Ahora que el geojson está cargado, podemos proceder con la lógica de release_ent_mex
        const dataMap = {};
        const statesData = getStatesData();
  
        if (!statesData || !statesData.features) {
          console.error("Error: statesData no está definido o no contiene 'features'");
          return;
        }
  
        fetch("http://127.0.0.1:45000/release/ent", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
          data.forEach(item => {
            dataMap[item.cve_ent] = { index: item.index_risk, info: item.info };
          });
  
          statesData.features.forEach(f => {
            const clave = f.properties.CODIGO;
            const entry = dataMap[clave] || { index: 0, info: 0 };
            f.properties.density = entry.index;
            f.properties.info = entry.info;
          });
  
          const geojsonLayer = L.geoJson(statesData, { style, onEachFeature }).addTo(map);
          setGeoJson(geojsonLayer);
        })
        .catch(err => console.error("Error al cargar release_ent_mex:", err));
      })
      .catch(err => {
        console.error("Error al cargar geojsonMexico:", err);
      });
  }
  
