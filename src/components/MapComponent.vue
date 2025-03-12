<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  data() {
    return {
      map: null,
      geojsonLayer: null,
      info: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      this.map = L.map("map").setView([21.657428, -100.942384], 5);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        minZoom: 1,
        attribution: "© OpenStreetMap",
      }).addTo(this.map);

      try {
        const response = await fetch("http://127.0.0.1:45000/geojson/mexico");
        const data = await response.json();
        this.geojsonLayer = L.geoJson(data, {
          onEachFeature: this.onEachFeature,
        }).addTo(this.map);
        this.initInfoControl();
      } catch (error) {
        console.error("Error al cargar los datos del mapa:", error);
      }
    },
    
    getColor(d,maxValue=1) {
        let normalizedValue = d / maxValue;
      return normalizedValue > 0.9 ? "#800026" :
      normalizedValue > 0.75 ? "#BD0026" :
      normalizedValue > 0.5 ? "#E31A1C" :
      normalizedValue > 0.25 ? "#FC4E2A" :
      normalizedValue > 0.1 ? "#FD8D3C" :
      normalizedValue > 0.05 ? "#FEB24C" :
      normalizedValue > 0.02 ? "#FED976" : "#FFEDA0";
    },
    style(feature) {
      return {
        fillColor: this.getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.zoomToFeature,
      });
    },
    highlightFeature(e) {
      var layer = e.target;
      this.info.update(layer.feature.properties);
      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });
      layer.bringToFront();
      this.info.update(layer.feature.properties);
    },
    resetHighlight(e) {
      this.geojsonLayer.resetStyle(e.target);
      this.info.update();
    },
    zoomToFeature(e) {
      this.map.fitBounds(e.target.getBounds());
    },
    
    initInfoControl() {
      this.info = L.control();
      this.info.onAdd = () => {
        this.info._div = L.DomUtil.create("div", "info");
        this.info.update();
        return this.info._div;
      };
      this.info.update = (props) => {
        this.info._div.innerHTML = `<h4>risk index</h4>${props ? `<b>${props.name}</b><br />index: ${props.density}` : "'Hover over a state'"}`;
      };
      this.info.addTo(this.map);
    },
  },
};
</script>

<template>
  <div id="map"></div>
</template>

<style>
#map{
    width: 100%;
    top: 0px;
    height: 100%;
    position: absolute;
    z-index: 1;
}
.info {
    padding: 6px 8px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    background: white;
    background: rgba(255,255,255,0.8);
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 5px;
}
.info h4 {
    margin: 0 0 5px;
    color: #777;
}
</style>


