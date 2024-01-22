<template>
    <div class="container mt-4">
    <div class="card col-md-6 mx-auto">
        <div class="card-header bg-success text-white text-center">
        <h2 class="card-title">Actualizar Tarea</h2>
        </div>
        <div class="card-body">
        <form @submit.prevent="editarTarea">
            <div class="form-group mb-3">
            <label for="codigoTarea" style="font-weight: bold;">Código:</label>
            <div class="input-group">
                <input
                v-model="codigoTarea"
                type="text"
                id="codigoTarea"
                class="form-control"
                placeholder="Código de la tarea"
                maxlength="6"
                readonly
                />
                <span class="input-group-text"><i class="fa-solid fa-barcode"></i></span>
            </div>
            </div>
            <div class="form-group mb-3">
            <label for="miTarea" style="font-weight: bold;">Descripción:</label>
            <div class="input-group">
                <input
                v-model="miTarea"
                type="text"
                id="miTarea"
                class="form-control"
                placeholder="Ingrese una breve descripción"
                maxlength="30"
                />
                <span class="input-group-text"><i class="fa-regular fa-message"></i></span>
            </div>
            </div>
            <div class="form-group mb-3">
            <label for="fechaInicio" style="font-weight: bold;">Fecha:</label>
            <input v-model="fechaInicio" type="date" id="fechaInicio" class="form-control" />
            </div>
            <div class="form-group mb-3">
            <label for="estado" style="font-weight: bold;">Estado:</label>
            <div class="input-group">
                <select v-model="estado" id="estado" class="form-select">
                <option value="Pendiente" selected>Pendiente</option>
                <option value="Terminada">Terminada</option>
                </select>
            </div>
            </div>
            <hr />
            <div class="text-center d-flex justify-content-center">
            <button type="submit" class="btn btn-primary btn-hover-dark">
                <i class="fa-solid fa-floppy-disk"></i> Guardar
            </button>
            <RouterLink to="/" class="nav-link" :class="{ 'nav-link-selected': $route.path === '/' }">
                <button class="btn btn-danger btn-hover-dark ms-2" @click="cancelar">
                <i class="fas fa-window-close"></i> Cancelar
                </button>
            </RouterLink>          
            </div>
        </form>
        </div>
    </div>
    </div>
</template>
    
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

class JsonStringDateTimeConverter {
    static read(jsonDate) {
        if (jsonDate) {
            const dateParts = jsonDate.split('/');
            if (dateParts.length === 3) {
                const day = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10) - 1;
                const year = parseInt(dateParts[2], 10);
                
                return new Date(Date.UTC(year, month, day));
            }
        }
        return null;
    }

    static write(date) {
        if (date instanceof Date) {
            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${day}/${month}/${year}`;
        }
        return null;
    }
}

const codigoTarea = ref('');
const miTarea = ref('');
const fechaInicio = ref('');
const estado = ref('Pendiente');

const tarea = ref({
    codigoTarea: '',
    miTarea: '',
    fechaInicio: '',
    estado: '',
});

const router = useRouter();

const editarTarea = async () => {
    try {
        const url = `https://localhost:7275/api/tareas/${codigoTarea.value}`;

        const respuesta = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                Codigotarea: codigoTarea.value,
                Mitarea: miTarea.value,
                Fechainicio: JsonStringDateTimeConverter.write(new Date(fechaInicio.value)),
                Estado: estado.value,
        }),
            headers: {
                'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
        });

        if (respuesta.ok) {
            alert('Datos actualizados de manera exitosa');

            codigoTarea.value = '';
            miTarea.value = '';
            fechaInicio.value = '';
            estado.value = 'Pendiente';

            router.push('/');
        } 
        else {
            alert('Error al actualizar tarea');
            const errorData = await respuesta.json();
            console.error('Error en la solicitud PUT:', errorData);
            console.error('Errores de validación:', errorData.errors);
        }
    } 
    catch (error) {
        console.error('Error al actualizar tarea:', error);
    }
};

onBeforeMount(() => {
    const route = useRoute();

    tarea.value = {
        codigoTarea: route.params.codigoTarea || '',
        miTarea: route.params.miTarea || '',
        fechaInicio: route.params.fechaInicio
        ? JsonStringDateTimeConverter.read(route.params.fechaInicio).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
        estado: route.params.estado || 'Pendiente',
    };

    codigoTarea.value = tarea.value.codigoTarea;
    miTarea.value = tarea.value.miTarea;
    fechaInicio.value = tarea.value.fechaInicio;
    estado.value = tarea.value.estado;
});

onMounted(() => {
    document.getElementById('miTarea').focus();
});
</script>
    
<style>
body {
    font-family: 'Arial', sans-serif;
}

.btn-hover-dark:hover {
    filter: brightness(85%);
}
</style>