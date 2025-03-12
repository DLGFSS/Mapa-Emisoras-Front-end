<template>
  <nav class="contenido">
    <div class="contenedor1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-list"
        viewBox="0 0 16 16"
      >
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
          <select v-model="estadoSeleccionado" @change="cargarMunicipios" class="form-select" aria-label="Default select example">
            <option v-for="estado in estados" :key="estado.codigo" :value="estado.codigo">
              {{ estado.nombre }}
            </option>
          </select>
        </div>

        <br />

        <div class="d-flex align-items-center gap-2">
          <label for="municipality">Municipality:</label>
          <select  class="form-select" aria-label="Default select example">
            
          </select>
        </div>

        <br />

        <div class="d-flex align-items-center gap-2">
          <label for="release">Release:</label>
          <select class="form-select" aria-label="Default select example">

          </select>
        </div>

        <br />

        <label for="customRange1" class="form-label">Year:</label>
        <input type="range" class="form-range" id="customRange1" min="2004" max="2022" />

        <div class="contenedorbtn">
          <button id="play" type="button" class="botonplay">Play</button>
          <button id="delete" type="button" class="botondelete">Delete</button>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEstados } from '@/services/api';

const estados = ref([]);


const cargarEstados = async () => {
  try {
    const data = await getEstados();
    console.log('estados:', data); 
    
      estados.value = data.map((estado) => ({
        codigo: estado.CODIGO,
        nombre: estado.ESTADO,
      }));
    
  } catch (error) {
    console.error('Erro', error);
  }
};

onMounted(() => {
  cargarEstados();
});
</script>



<style scoped>

.contenido {
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

.botonplay {
  font-size: 1rem;
  color: white;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 10px;
  border: 2px solid green;
  background: green;
  box-shadow: 5px 5px rgb(7, 84, 7);
  cursor: pointer;
  margin: 35px 0;
}

.botonplay:active {
  box-shadow: none;
  transform: translate(5px, 5px);
}

.botondelete {
  font-size: 1rem;
  color: white;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 10px;
  border: 2px solid rgb(189, 41, 41);
  background: rgb(189, 41, 41);
  box-shadow: 5px 5px rgb(104, 15, 15);
  cursor: pointer;
  margin: 35px 0;
}

.botondelete:active {
  box-shadow: none;
  transform: translate(5px, 5px);
}
</style>
