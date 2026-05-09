// src/stores/usuarioStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

// Definimos a store para xestionar o estado do usuario seleccionado

export const useUsuarioStore = defineStore("usuario", () => {
  const id = ref(null);
  const nome = ref("");

  const numeroTarefas = ref(0);

  // Función para seleccionar un usuario e actualizar o estado

  function seleccionarUsuario(usuario) {
    id.value = usuario.id;
    nome.value = usuario.nome;
  }

  // Función para actualizar o número de tarefas do usuario
  function actualizarNumeroTarefas(total) {
    numeroTarefas.value = total;
  }

  // Función para limpar o usuario seleccionado

  function limparUsuario() {
    id.value = null;
    nome.value = "";
  }

  // Devolvemos o estado e as accións dispoñibles na store
  return {
    id,
    nome,
    numeroTarefas,
    seleccionarUsuario,
    limparUsuario,
    actualizarNumeroTarefas,
  };
});
