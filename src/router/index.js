import { createRouter, createWebHistory } from "vue-router";
import IniCio from "../components/IniCio.vue";
import XestionUsuarios from "../components/XestionUsuarios.vue";
import XestionTarefas from "../components/XestionTarefas.vue";
import SobreNos from "../components/SobreNos.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
  { path: "/", name: "inicio", component: IniCio },
  { path: "/usuarios", name: "usuarios", component: XestionUsuarios },
  { path: "/tarefas", name: "tarefas", component: XestionTarefas },
  { path: "/tarefas/:id", name: "xestionTarefas", component: XestionTarefas },
  { path: "/sobrenos", name: "sobrenos", component: SobreNos },
  { path: "/avisolegal", name: "avisolegal", component: AvisoLegal },
  { path: "/:pathMatch(.*)", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
