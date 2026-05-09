<template>
  <div class="xestion-tarefas">
    <div class="barra-superior" v-if="usuarioStore.id">
      Usuario: {{ usuarioStore.nome }} | Tarefas: {{ usuarioStore.numeroTarefas }}
    </div>
    <h3 v-if="usuario">📝 Código Usuario: {{ usuario.id }} === Tarefas de {{ usuario.nome }}</h3>
    <p v-else>Non hai usuario seleccionado</p>

    <!-- FORMULARIO -->
    <form @submit.prevent="engadirTarefa" class="form-tarefa">
      <input v-model="novaTarefa.dataLimite" type="date" required />

      <textarea v-model="novaTarefa.titulo" placeholder="Título ou descrición da tarefa" maxlength="256" rows="3"
        required></textarea>
      <select v-model="novaTarefa.prioridade" required>
        <option value="">-- Prioridade --</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baixa">Baixa</option>
      </select>

      <button type="submit">
        {{ tarefaEditandoId ? "Actualizar tarefa" : "Grabar tarefa" }}
      </button>

      <button v-if="tarefaEditandoId" type="button" @click="cancelarEdicion">
        Cancelar
      </button>
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
          <th>Prioridade</th>
          <th>Estado</th>
          <th>Accións</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(t, index) in tarefas" :key="index">
          <td style="text-align: center">{{ index + 1 }}</td>
          <td>{{ t.titulo }}</td>
          <td style="text-align: center">{{ t.dataLimite }}</td>
          <td style="text-align: center">{{ t.prioridade }}</td>
          <td style="text-align: center">
            {{ t.completada ? "✅" : "❌" }}
          </td>
          <td style="text-align: center">
            <button @click="editarTarefa(t)">✏️</button>
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
const tarefaEditandoId = ref(null);

const novaTarefa = ref({
  titulo: "",
  dataLimite: "",
  prioridade: ""
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

    usuarioStore.seleccionarUsuario(usuario.value);

    const resTarefas = await getTarefas(idUsuario);
    tarefas.value = resTarefas.data;
    usuarioStore.actualizarNumeroTarefas(tarefas.value.length);
  } catch (error) {
    console.error("Erro ao cargar datos", error);
  };
},
  { immediate: true }

);


//  Crear tarefa
async function engadirTarefa() {
  if (!usuario.value) return;

  const datosTarefa = {
    titulo: novaTarefa.value.titulo,
    dataLimite: novaTarefa.value.dataLimite,
    prioridade: novaTarefa.value.prioridade,
    usuarioId: usuario.value.id,
    usuarioNome: usuario.value.nome,
  };

  try {
    if (tarefaEditandoId.value) {
      const res = await updateTarefa(tarefaEditandoId.value, datosTarefa);

      const index = tarefas.value.findIndex(
        (t) => t.id === tarefaEditandoId.value
      );

      if (index !== -1) {
        tarefas.value.splice(index, 1, res.data);
      }

      tarefaEditandoId.value = null;
    } else {
      const nova = {
        ...datosTarefa,
        completada: false,
      };

      const res = await createTarefa(nova);
      tarefas.value.push(res.data);

      usuarioStore.actualizarNumeroTarefas(tarefas.value.length);
    }

    limparFormulario();
  } catch (error) {
    console.error("Erro ao gardar tarefa", error);
  }
}

function editarTarefa(tarefa) {
  tarefaEditandoId.value = tarefa.id;

  novaTarefa.value = {
    titulo: tarefa.titulo,
    dataLimite: tarefa.dataLimite,
    prioridade: tarefa.prioridade || "",
  };
}

function cancelarEdicion() {
  tarefaEditandoId.value = null;
  limparFormulario();
}

function limparFormulario() {
  novaTarefa.value = {
    titulo: "",
    dataLimite: "",
    prioridade: "",
  };
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

.barra-superior {
  width: 80%;
  max-width: 1000px;
  background-color: #007bff;
  color: white;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
  border-radius: 6px;
}

.form-tarefa select {
  padding: 0.4rem;
  border: 1px solid #ddd;
  width: 220px;
}
</style>
