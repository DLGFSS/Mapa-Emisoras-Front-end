<template>
  <div id="map">
   <div id="sidebar">
     <h2>Description</h2>
     <div id="muestras" class="container center"></div>
   </div>
 </div>
 
 
 </template>
 
 <script>
 import { createMap } from "@/services/map"; 
 import { geojsonMexico } from "@/services/geojson";
 
 export default {
   name: "MapComponent",
   mounted() {
    
     const map = createMap();
     let geojson = null;
     geojsonMexico(map, geojson);
   },
 };
 </script>
 
 <style scoped>
 #map {
   width: 100%;
   height: 100vh;
   position: relative; 
 }
 
 #sidebar {
   position: absolute;
   top: 50%;
   right: 20px;
   width: 300px;
   max-height: 300px;
   background-color: white;
   border: 1px solid #ccc;
   border-radius: 12px;
   padding: 1rem;
   z-index: 1000;
   box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
   overflow-y: auto;
 }
 
 </style>
 