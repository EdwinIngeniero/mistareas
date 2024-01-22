import { createStore } from 'vuex';

export default createStore({
    state: {
        tareas: [],
    },
    mutations: {
        setTareas(state, tareas) {
            state.tareas = tareas;
        },
    },
    actions: {
        async cargarTareas({ commit }, valorEstado) {
            try {
                const url = `https://localhost:7275/api/tareas/estado/${valorEstado}`;
                const respuesta = await fetch(url);

                if (respuesta.ok) {
                    const tareas = await respuesta.json();
                    commit('setTareas', tareas);
                } 
                else {
                    console.error("Error al obtener tareas");
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    getters: {
        getTareas: (state) => state.tareas,
    },
})