/* eslint-disable */
import L from "leaflet";
import "leaflet/dist/leaflet.css";

let map = null;
var info = L.control();
var geojson;

export function createMap() {
  if (map) {
    return map; 
  }

  
  map = L.map("map").setView([21.657428, -100.942384], 5); 

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 1,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  info.addTo(map);

  return map; 
}

export function getMap() {
  return map; 
}

// interactividad y estilos
export function getColor(d, maxValue = 1) {
    let normalizedValue = d / maxValue;
    return normalizedValue > 0.9 ? '#800026' :
      normalizedValue > 0.75 ? '#BD0026' :
      normalizedValue > 0.5 ? '#E31A1C' :
      normalizedValue > 0.25 ? '#FC4E2A' :
      normalizedValue > 0.1 ? '#FD8D3C' :
      normalizedValue > 0.05 ? '#FEB24C' :
      normalizedValue > 0.02 ? '#FED976' :
      '#FFEDA0';
  }
  
  export function style(feature) {
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }
  
  
  
  export function highlightFeature(e) {
    const layer = e.target;
    info.update?.(layer.feature.properties); 
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
    layer.bringToFront();
  }
  
  export function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }
  
  export function desglose(props) {
    let p = "";
    for (const [key, value] of Object.entries(props)) {
      p += `<h6>${key}: ${value}</h6>`;
    }
    return p;
  }
  
  export function showInfo(e) {
    const layer = e.target;
    const properties = layer.feature.properties;
  
    const sidebarContent = document.getElementById('sidebar');
  
    if (!sidebarContent) {
      console.warn("No se encontró el elemento con id 'sidebar'.");
      return;
    }
    let div_muestra = document.getElementById("muestras");
    if (!div_muestra) {
      sidebarContent.innerHTML = `
        <div class="container">
          <h2>Description</h2>
          <div class="container center" id="muestras"></div>
        </div>
      `;
      div_muestra = document.getElementById("muestras");
    }
    if (properties.info) {
      div_muestra.innerHTML = `
        <h4>${properties.name}</h4>
        <h6>index: ${properties.density}</h6>
        ${desglose(properties.info)}
      `;
    } else {
      div_muestra.innerHTML = `
        <h4>${properties.name}</h4>
        <h6>Sin información disponible</h6>
      `;
    }
  }
  
  
  export function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: showInfo,
    });
  }
  

  export function setGeoJson(layer) {
    geojson = layer;
  }
  export function getGeoJson() {
    return geojson;
  }

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
  };
  
  info.update = function (props) {
    this._div.innerHTML = '<h4>index</h4>' + (props ?
      '<b>' + props.name + '</b><br />index: ' + props.density
      : 'Hover over a state');
  };

  let statesData = null;

export function setStatesData(data) {
    statesData = data;
}

export function getStatesData() {
    return statesData;
}
