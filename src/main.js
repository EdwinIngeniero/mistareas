import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import store from './store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
    {
        name: 'tareas',
        path: '/',
        component: () => import('./components/Tareas.vue')
    },
    {
        name: 'nueva',
        path: '/nuevatarea',
        component: () => import('./components/NuevaTarea.vue')
    },
    {
        name: 'editartarea',
        path: '/editartarea/:codigoTarea/:miTarea/:fechaInicio/:estado',
        component: () => import('./components/EditarTareas.vue')
    }
    ]
});


const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
