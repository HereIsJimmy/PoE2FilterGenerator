import { createWebHistory, createRouter } from "vue-router";
import CreateFilter from "../components/CreateFilter.vue";

const routes = [
    {
        path: "/",
        name: "CreateFilter",
        component: CreateFilter,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;