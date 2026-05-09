import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//GET usuarios
export const getUsuarios = async () => {
  return await axios.get(`${API_URL}/usuarios`);
};

//GET usuario by id
export const getUsuarioById = async (id) => {
  return await axios.get(`${API_URL}/usuarios/${id}`);
};

// POST usuario
export const createUsuario = async (usuario) => {
  debugger;
  return await axios.post(`${API_URL}/usuarios`, usuario);
};
// UPDATE usuario
export const updateUsuario = async (id, usuario) => {
  return await axios.put(`${API_URL}/usuarios/${id}`, usuario);
};
//DELETE usuario
export const deleteUsuario = async (id) => {
  return await axios.delete(`${API_URL}/usuarios/${id}`);
};
