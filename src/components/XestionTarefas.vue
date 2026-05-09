<template>
  <div class="xestion-tarefas">
    <h3 v-if="usuario">📝 Código Usuario: {{ usuario.id }} === Tarefas de {{ usuario.nome }}</h3>
    <p v-else>Non hai usuario seleccionado</p>

    <!-- FORMULARIO -->
    <form @submit.prevent="engadirTarefa" class="form-tarefa">
      <input v-model="novaTarefa.dataLimite" type="date" required />

      <textarea v-model="novaTarefa.titulo" placeholder="Título ou descrición da tarefa" maxlength="256" rows="3"
        required></textarea>

      <button type="submit">Grabar tarefa</button>
    </form>

    <!-- LISTAXE -->
    <p v-if="tarefas.length === 0">
      Non hai tarefas.
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tarefa</th>
          <th>Data límite</th>
          <th>Estado</th>
          <th>Accións</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(t, index) in tarefas" :key="index">
          <td style="text-align: center">{{ index + 1 }}</td>
          <td>{{ t.titulo }}</td>
          <td style="text-align: center">{{ t.dataLimite }}</td>
          <td style="text-align: center">
            {{ t.completada ? "✅" : "❌" }}
          </td>
          <td style="text-align: center">
            <button @click="completarTarefa(index)" :disabled="t.completada">
              ✔️
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useUsuarioStore } from "../store/usuarioStore.js";
import {
  getTarefas,
  createTarefa,
  updateTarefa
} from "../services/tarefas.service.js";
import {
  getUsuarioById
} from "../services/usuarios.service.js";
import { useRoute } from "vue-router";
import { watch } from "vue";

const route = useRoute();
const usuario = ref(null);
const tarefas = ref([]);

const novaTarefa = ref({
  titulo: "",
  dataLimite: "",
});

// Instanciamos a store de usuario
const usuarioStore = useUsuarioStore();

//  Cargar tarefas
// cargar datis ao cambiar a ruta
watch(() => route.params.id, async (idUsuario) => {
  if (!idUsuario) {
    return;
  }
  try {
    const resUsuario = await getUsuarioById(idUsuario);
    usuario.value = {
      id: resUsuario.data.id,
      nome: resUsuario.data.nome
    };

    const resTarefas = await getTarefas(idUsuario);
    tarefas.value = resTarefas.data;
  } catch (error) {
    console.error("Erro ao cargar datos", error);
  };
},
  { immediate: true }

);
/* onMounted(async () => {
  debugger;
  if (!usuarioStore.id) {
    return;
  }
  usuario.value = {
    id: usuarioStore.id,
    nombre: usuarioStore.nome
  }
  try {
    const res = await getTarefas(usuario.value.id);
    tarefas.value = res.data;
  } catch (error) {
    console.error("Erro ao cargas as tarefas: ", error);
  }

});

onUnmounted(() => {
  usuarioStore.limparUsuario();
  tarefas.value = [];
}); */

//  Crear tarefa
async function engadirTarefa() {
  try {
    const nova = {
      titulo: novaTarefa.value.titulo,
      dataLimite: novaTarefa.value.dataLimite,
      completada: false,
      usuarioId: usuario.value.id,
      usuarioNome: usuario.value.nome
    };

    const res = await createTarefa(nova);
    tarefas.value.push(res.data);

    novaTarefa.value.titulo = "";
    novaTarefa.value.dataLimite = "";
  } catch (error) {
    console.error("Erro ao gardar tarefa", error);
  }
}

//  Completar tarefa
async function completarTarefa(index) {
  const tarefa = tarefas.value[index];

  try {
    const res = await updateTarefa(tarefa.id, {
      completada: true,
    });

    tarefas.value.splice(index, 1, res.data);
  } catch (error) {
    console.error("Erro ao actualizar tarefa", error);
  }
}
</script>

<style scoped>
.xestion-tarefas {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 👈 centra horizontalmente todo */
  background: white;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-tarefa {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  margin: 0 auto;
  /* centra o formulario */
}


.form-tarefa textarea {
  resize: vertical;
  padding: 0.5rem;
  border: 1px solid #ddd;
}

.form-tarefa input {
  padding: 0.4rem;
  text-align: center;
  border: 1px solid #ddd;
  width: 200px;

}

.form-tarefa textarea {
  width: 100%;
}

.form-tarefa button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  cursor: pointer;
  align-self: center;
  /* centra o botón */
}

.tabla-container {
  display: flex;
  justify-content: center;
}

table {
  width: 80%;
  max-width: 1000px;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.7rem;
}

th {
  background-color: #f8f9fa;
  text-align: center;
}

h4 {
  margin-bottom: 1rem;
  background-color: #73aff0;
  color: white;
  padding: 0.5rem;
}
</style>
