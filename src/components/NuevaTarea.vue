<template>
    <div class="container mt-4">
    <div class="card col-md-6 mx-auto">
        <div class="card-header bg-success text-white text-center">
        <h2 class="card-title">Nueva Tarea</h2>
        </div>
        <div class="card-body">
        <form>
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
            <hr/>
            <div class="text-center d-flex justify-content-center">
            <button type="button" class="btn btn-primary btn-hover-dark" @click="ingresarTarea">
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
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

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

const router = useRouter();

const ingresarTarea = async () => {
    try {
        if (!codigoTarea.value || !miTarea.value || !fechaInicio.value) {
            alert('Por favor complete todos los campos del formulario');
            document.getElementById('codigoTarea').focus();
            return;
        }

        if (isNaN(codigoTarea.value)) {
            alert('El código de la tarea debe ser numérico');
            document.getElementById('codigoTarea').focus();
            return;
        }

        const url = 'https://localhost:7275/api/tareas';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                CodigoTarea: parseInt(codigoTarea.value),
                MiTarea: miTarea.value,
                FechaInicio: JsonStringDateTimeConverter.write(new Date(fechaInicio.value)),
                Estado: estado.value,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (respuesta.ok) {
            alert('Datos ingresados de manera exitosa');
            codigoTarea.value = '';
            miTarea.value = '';
            fechaInicio.value = '';
            estado.value = 'Pendiente';

            router.push('/');
        } else {
            const data = await respuesta.json();
            alert(data.mensaje);
            await nextTick();
            document.getElementById('codigoTarea').focus();
        }
    } catch (error) {
        console.error('Error al ingresar tarea:', error);
        alert('Error al realizar la solicitud al servidor. Consulta la consola para obtener más detalles.');
    }
};

onMounted(() => {
    document.getElementById('codigoTarea').focus();
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