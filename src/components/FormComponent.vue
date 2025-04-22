<template>
  <nav class="contenido">
    <div class="contenedor1">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
        <path
          fill-rule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
        />
      </svg>
    </div>

    <div class="contenedor2">
      <ul class="navbar-nav">
       
        <div class="d-flex align-items-center gap-2">
          <label for="states">States:</label>
          <select v-model="estadoSeleccionado" @change="onEstadoSeleccionado" class="form-select">
            <option value="" disabled>Select a state</option>
            <option v-for="(estado, i) in estados" :key="estado.codigo" :value="estado.codigo">
              {{ String(i + 1).padStart(2, '0') }} - {{ estado.nombre }}
            </option>
          </select>
        </div>
        <br />

        <div class="d-flex align-items-center gap-2">
          <input type="checkbox" id="all" v-model="seleccionarTodos" @change="toggleMunicipios" />
          <label for="all"> All municipalities</label>
        </div>
        <br />

       
        <div class="d-flex align-items-center gap-2">
          <label for="municipality">Municipality:</label>
          <select v-model="municipioSeleccionado" class="form-select" :disabled="seleccionarTodos">
            <option value="" disabled>Select a municipality</option>
            <option v-for="municipio in municipios" :key="municipio.cve_mun" :value="municipio.cve_mun">
              {{ municipio.cve_mun }} - {{ municipio.municipio }}
            </option>
          </select>
        </div>
        <br />

     
        <div class="d-flex align-items-center gap-2">
          <label for="release">Release:</label>
          <select v-model="sustanciaSeleccionada" class="form-select">
            <option value="" disabled>Select a substance</option>
            <option v-for="sustancia in sustancias" :key="sustancia.cas" :value="sustancia.cas">
              {{ sustancia.name }}
            </option>
          </select>
        </div>
        <br />

       
        <div class="d-flex align-items-center gap-2">
          <label for="customRange1" class="form-label">Year:</label>
          <input type="range" class="form-range" v-model="customRange1" min="2004" max="2022" />
        </div>
        <span>Selected Year: {{ customRange1 }}</span>
        <br />

       
        <div class="d-flex align-items-center gap-2">
          <label for="radius" class="form-label">Radius:</label>
          <input type="range" class="form-range" v-model="radius" min="2" max="15" />
        </div>
        <span>Selected radius: {{ radius }} km</span>
        <br />

        
        <div class="d-flex align-items-center gap-2">
          <label class="switch">
            <input type="checkbox" v-model="mostrarPoblacion" />
            <span class="slider"></span>
          </label>
          <label for="population"> Population</label>
        </div>
        <br />

      
        <div class="contenedorbtn">
          <button type="button" class="botonplay" @click="ejecutarAccion">Play</button>
          <button type="button" class="botondelete" @click="borrarSeleccion">Delete</button>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script>
import { getSustancias, getMunicipios, getEstados } from '@/services/api';
import { geoJsonM} from '@/services/geojson'
import { createMap } from '@/services/map';
import { release_ent_mex ,release_all_mun,release_ent} from '@/services/mapaCalor'

export default {
  data() {
    return {
      estados: [],
      municipios: [],
      sustancias: [],
      estadoSeleccionado: '',
      municipioSeleccionado: '',
      sustanciaSeleccionada: '',
      seleccionarTodos: false,
      customRange1: 2022,
      radius: 5,
      mostrarPoblacion: false,
    };
  },
  async mounted() {
    const map = createMap();
    this.map = map; 


    this.estados = await getEstados();
    this.sustancias = await getSustancias();
  },
  methods: {

    async onEstadoSeleccionado() {
    if (this.estadoSeleccionado && this.estadoSeleccionado !== "none") {
      await this.cargarMunicipios();         
      geoJsonM(this.estadoSeleccionado,this.map);    
    }
  },

    async cargarMunicipios() {
      this.municipios = await getMunicipios(this.estadoSeleccionado);
    },

    toggleMunicipios() {
      if (this.seleccionarTodos) {
        this.municipioSeleccionado = '';
      }
    },
    ejecutarAccion() {
      console.log("Accion ejecutada");
      console.log("estado "+this.estadoSeleccionado);
      console.log("municipio "+this.municipioSeleccionado);
      console.log("sustancia "+this.sustanciaSeleccionada);
      console.log("Año "+this.customRange1);
      console.log("Rango "+this.radius);
      try {
      if (this.seleccionarTodos) {
         release_all_mun(this.map, this.estadoSeleccionado, this.sustanciaSeleccionada, this.customRange1);
        
      } else {
        if (!this.estadoSeleccionado) {
           release_ent_mex(this.map, this.sustanciaSeleccionada, this.customRange1);
           
        } else if (!this.municipioSeleccionado) {
          console.log("release ent");
           release_ent(this.map, this.estadoSeleccionado, this.sustanciaSeleccionada, this.customRange1);
           
        } else {
          console.log("mostrar puntos de las emisoras para municipio");
         
        }
      }
    } catch (error) {
      console.error("Error al ejecutar la acción:", error);
    }
    },
    borrarSeleccion() {
      this.estadoSeleccionado = '';
      this.municipioSeleccionado = '';
      this.sustanciaSeleccionada = '';
      this.seleccionarTodos = false;
      this.customRange1 = 2022;
      this.radius = 5;
      this.mostrarPoblacion = false;
      this.municipios = [];
    },
  },
};
</script>

  
  <style scoped>
  .contenido {
    z-index: 1000;
    top: 0px;
    width: 25%;
    height: 100%;
    position: fixed;
    background-color: white;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
  }
  
  .contenedor1 {
    text-align: right;
    height: 10%;
    padding: 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #000000;
    border-top-right-radius: 25px;
  }
  
  .contenedor2 {
    width: 75%;
    height: 75%;
    padding: 20px;
    margin: 10%;
    margin-bottom: 50px;
  }
  
  .contenedorbtn {
    display: flex;
    gap: 15px;
  }
  
  .botonplay,
  .botondelete {
    font-size: 1rem;
    color: white;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 10px;
    cursor: pointer;
    margin: 35px 0;
  }
  
  .botonplay {
    border: 2px solid green;
    background: green;
    box-shadow: 5px 5px rgb(7, 84, 7);
  }
  
  .botonplay:active {
    box-shadow: none;
    transform: translate(5px, 5px);
  }
  
  .botondelete {
    border: 2px solid rgb(189, 41, 41);
    background: rgb(189, 41, 41);
    box-shadow: 5px 5px rgb(104, 15, 15);
  }
  
  .botondelete:active {
    box-shadow: none;
    transform: translate(5px, 5px);
  }
  </style>
  