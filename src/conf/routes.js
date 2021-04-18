import Task from "../pages/Task";
import Login from "../pages/Login";
import Lista from "../pages/Lista";
import Update from "../pages/Update"

const routes = [
    {path: "/", name: "home", component: Task},
    {path: "/task", name: "task", component: Task},
    {path: "/login", name: "login", component: Login},
    {path: "/lista", name: "lista", component: Lista},
    {path: "/task/:id", name: "update", component: Update},
];

export default routes;
