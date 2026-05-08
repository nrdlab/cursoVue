<template>
  <div id="app">
    <!-- Aquí se carga el componente principal DE MOMENTO-->
    <NavBar />
    <main>
      <router-view />
    </main>
    <FooTer />
  </div>
</template>

<script setup>

import NavBar from './components/NavBar.vue';
import FooTer from './components/FooTer.vue';
</script>

<style>
/* 👇 Estilos globales mínimos */
:global(body) {
  margin: 0;
  /* quita el margen por defecto del body */
  background: #f6f6f6;
  /* color de fondo general */
}

#app {
  max-width: 80vw;
  margin: 0 auto;
  /* centra horizontalmente */
}

.navbar,
.footer {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  z-index: 1000;
}

.navbar {
  top: 0;
}

.footer {
  bottom: 0;
}

main {
  margin-top: 80px;
  margin-bottom: 80px;
}

/* Cuando la pantalla es menor a 768px */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
</style>
