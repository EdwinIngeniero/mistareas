<template>
<div id="contenedor" class="container mt-4">
    <div class="card">
        <div class="card-header bg-success text-white text-center">
            <h1 class="mx-auto"><i class="fas fa-tasks"></i> Mi lista de tareas</h1>
        </div>
        <div class="card-body">
            <div class="d-flex flex-wrap flex-row align-items-center">
                <div class="custom-search-bar input-group mb-2 mb-md-0">
                    <input v-model="tareasResu" type="text" class="form-control" id="tareasResu" 
                    placeholder="Buscar por Actividad" aria-label="Buscar" maxlength="30"
                    aria-describedby="button-addon2" @input="realizarBusqueda" required>       
                </div>                 
                <div class="form-group">
                    <div class="input-group mb-2 mb-md-0">
                    <select @change="filtrarPorEstado" class="form-select" id="filtroEstado">
                    <option value="-- Selecciona Estado --" selected disabled>-- Selecciona Estado --</option>
                    <option value="Todos">Lista completa</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="Terminada">Terminadas</option>
                    </select>
                    </div>
                </div>
                <RouterLink to="/nuevatarea" class="nav-link" :class="{ 'nav-link-selected': $route.path === '/nuevatarea' }">
                    <button class="btn btn-outline-secondary btn-custom ms-2 input-group mb-2 mb-md-0 btn-sm"><i class="fa-solid fa-plus"></i> Nueva Tarea</button>
                </RouterLink>
            </div>
            <hr>
            <!-- Tabla con la lista de tareas -->
            <div id="tareas" class="mt-4 overflow-auto">
                <div v-if="mostrarMensajeNoEncontrado" class="alert alert-danger">
                    <p class="mb-0 text-center text-danger">No se encontraron resultados</p>
                </div>
                <table class="table" v-if="!mostrarMensajeNoEncontrado">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col" class="text-center align-middle">Código</th>
                            <th scope="col" class="text-center align-middle">Actividad</th>
                            <th scope="col" class="text-center align-middle">Fecha inicio</th>
                            <th scope="col" class="text-center align-middle">Dias activos</th>
                            <th scope="col" class="text-center align-middle">Estado</th>
                            <th scope="col" class="text-center align-middle">Acciones</th>
                        </tr>
                    </thead>
                    <tbody v-if="tareas && tareas.length > 0">
                        <tr v-for="(tarea, index) in tareas.slice((currentPage - 1) * perPage, currentPage * perPage)"
                            :key="tarea.codigoTarea" :class="{'table-secondary': index % 2 === 0, 'table-light': index % 2 !== 0}">
                            <td class="text-center align-middle marcado-codigo"><span>{{ tarea.codigoTarea }}</span></td>
                            <td class="text-center align-middle">{{ tarea.miTarea }}</td>
                            <td class="text-center align-middle">{{ tarea.fechaInicio }}</td>
                            <td class="text-center align-middle">{{ tarea.diasActivos }}</td>
                            <td class="text-center align-middle"
                                :class="{'marcado-rojo': tarea.estado === 'Pendiente','marcado-verde': tarea.estado === 'Terminada'}">
                                <span>{{ tarea.estado }}</span>
                            </td>
                            <td class="text-center align-middle">
                                <button class="btn btn-primary btn-sm btn-hover-dark"
                                    @click="redirigirAEdicion(tarea.codigoTarea, tarea.miTarea, tarea.fechaInicio, tarea.estado)">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn-danger btn-sm btn-hover-dark"
                                    @click="eliminarUsuario(tarea.codigoTarea)">
                                    <i class="fa fa-trash"></i> Eliminar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<br>

<!-- Paginación del proyecto --> 
<nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
        <li class="page-item" :class="{'disabled': currentPage === 1}">
            <a class="page-link" href="#" aria-label="Previous" @click="prevPage">
                <span aria-hidden="true">&laquo; Anterior</span>
            </a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page"
            :class="{'active': page === currentPage}">
            <a class="page-link" href="#" @click="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': currentPage === totalPages}">
            <a class="page-link" href="#" aria-label="Next" @click="nextPage">
                <span aria-hidden="true">Siguiente &raquo;</span>
            </a>
        </li>
    </ul>
</nav>
</template>

<script setup>
import { ref, onMounted, computed, watch} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// Lista total de tareas llamadas desde la Api
const tareas = ref([]);

const obtenerTareas = async() => {
    try{
        const url = "https://localhost:7275/api/tareas";
        const respuesta = await fetch(url);

        if(respuesta.ok){
            tareas.value = await respuesta.json();
            totalItems.value = tareas.value.length;
        }
        else{
            console.error("Error al obtener tareas");
        }
    }
    catch(error){
        console.error(error);
    }
}
onMounted(obtenerTareas);

// Utilizamos vuex para acceder a los estados de las tareas
const store = useStore();

const filtrarPorEstado = async (event) => {
    try {
        const valorEstado = event.target.value; 

        if (valorEstado === "Todos") {
            await obtenerTareas();
            tareasResu.value = '';
        } else {
            await store.dispatch('cargarTareas', valorEstado);
            tareas.value = store.getters.getTareas;
            totalItems.value = tareas.value.length;
        }
        currentPage.value = 1;
        mostrarMensajeNoEncontrado.value = false;
    } catch (error) {
        console.error(error);
    }
};

// Variables para controlar el funcionamiento la paginación 
const perPage = ref(5);
const currentPage = ref(1);
const totalItems = ref(0);

const totalPages = computed(()=>Math.ceil(totalItems.value / perPage.value));

const prevPage = () => {
    if(currentPage.value > 1){
        currentPage.value--;
    }
}
const nextPage = () => {
    if(currentPage.value < totalPages.value){
        currentPage.value++;
    }
}
const changePage = (page) => {
    currentPage.value = page;
};

// Eliminamos las tareas que no necesitamos (consumimos la Api)
const eliminarUsuario = async (codigoTarea) => {
    const eliminar = window.confirm(`¿Estás seguro de que deseas eliminar la tarea ${codigoTarea}?`);

    if(eliminar){
        try{
            const url = `https://localhost:7275/api/tareas/${codigoTarea}`;
            const response = await fetch(url, {
            method: "DELETE",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            });
            if (response.ok) {
                alert("Eliminación exitosa");
                await obtenerTareas();
                window.location.href = 'http://localhost:5173/';
            } 
            else {
                alert("Error al ejecutar solicitud");
            }
        }
        catch(error){
            console.error(error);
        }
    }
    else{
        alert("Eliminación cancelada");
    }
}

// Conectamos con el componente de EditarTareas 
const router = useRouter();

const redirigirAEdicion = (codigoTarea, miTarea, fechaInicio, estado) => {
    router.push({
        name: 'editartarea',
        params: {
            codigoTarea: codigoTarea,
            miTarea: miTarea,
            fechaInicio: fechaInicio,
            estado: estado,
        },
    });
};

// Barra de busqueda y resultados por actividades
const tareasResu = ref('');
const mostrarMensajeNoEncontrado = ref(false);

async function realizarBusqueda() {
    try {
        const searchTerm = tareasResu.value.toLowerCase().trim();
        if (!searchTerm) {
            mostrarMensajeNoEncontrado.value = false;
            obtenerTareas();
            document.getElementById('filtroEstado').value = "-- Selecciona Estado --";
            return;
        }
        const url = `https://localhost:7275/api/tareas/mitarea/${searchTerm}`;
        const respuesta = await fetch(url);
        if (respuesta.ok) {

            const nuevosResultados = await respuesta.json();

            if (nuevosResultados.length > 0) {
                tareas.value = nuevosResultados;
                totalItems.value = nuevosResultados.length;
                currentPage.value = 1;
                mostrarMensajeNoEncontrado.value = false;
                document.getElementById('filtroEstado').value = "-- Selecciona Estado --";
            } else {
                tareas.value = [];
                totalItems.value = 0;
                currentPage.value = 1;
                mostrarMensajeNoEncontrado.value = true;
                document.getElementById('filtroEstado').value = "-- Selecciona Estado --";
            } 
        } else if (respuesta.status === 404) {
            mostrarMensajeNoEncontrado.value = true;
            document.getElementById('filtroEstado').value = "-- Selecciona Estado --";
        } else {
            console.error('Error al realizar la búsqueda:', respuesta.statusText);
            tareas.value = [];
            totalItems.value = 0;
            currentPage.value = 1;
            mostrarMensajeNoEncontrado.value = true;
            document.getElementById('filtroEstado').value = "-- Selecciona Estado --";
        }
    } catch (error) {
        console.error('Error al buscar el producto:', error.message);
        tareas.value = [];
        totalItems.value = 0;
        currentPage.value = 1;
        mostrarMensajeNoEncontrado.value = true;
        document.getElementById('filtroEstado').value = "-- Selecciona Estado --";
    }
}
</script>

<style src="/src/Styles/Tareas.css">

</style>