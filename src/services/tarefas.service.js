import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//GET tarefas
export const getTarefas = async (usuarioId) => {
    return await axios.get(`${API_URL}/tarefas?usuarioId=${usuarioId}`);
}

// POST tarefa
export const createTarefa = async (tarefa) => {
    return await axios.post(`${API_URL}/tarefas`, tarefa);
}
// UPDATE usuario
export const updateTarefa = async (id, tarefa) => {
    return await axios.patch(`${API_URL}/tarefas/${id}`, tarefa);
}
