// Esperar a que todo el HTML esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Capturar los elementos del DOM que vamos a usar mediante sus IDs
    const formularioEnvio = document.getElementById("form-registro-envio");
    const listaEnvios = document.getElementById("lista-envios");
    const totalEnviosElemento = document.getElementById("total-envios");
    const mensajeValidacion = document.getElementById("mensaje-validacion");

    // Contador de registros totales
    let totalEnvios = 0;

    // 2. Escuchar el evento 'submit' (envío) del formulario usando addEventListener()
    formularioEnvio.addEventListener("submit", function(evento) {
        
        // Evita que la página se recargue y se borren los datos (Requisito obligatorio)
        evento.preventDefault();

        // Obtener los valores que el usuario escribió en los campos del formulario
        const cliente = document.getElementById("clienteEnvio").value.trim();
        const descripcion = document.getElementById("descripcionEnvio").value.trim();
        const categoria = document.getElementById("categoriaEnvio").value;

        // 3. Validación básica: comprobar que los campos no estén vacíos
        if (cliente === "" || descripcion === "" || categoria === "") {
            // Mostrar mensaje dinámico de error usando clases de Bootstrap
            mensajeValidacion.className = "alert alert-danger mt-3";
            mensajeValidacion.textContent = "⚠️ Error: Todos los campos son obligatorios para registrar el envío.";
            mensajeValidacion.classList.remove("d-none");
            return; // Detiene la función si hay error
        }

        // Si pasa la validación, ocultamos el mensaje de error anterior si existía
        mensajeValidacion.classList.add("d-none");

        // 4. Crear elementos HTML dinámicamente usando createElement() (Requisito obligatorio)
        const nuevaTarjeta = document.createElement("div");
        // Aplicamos clases responsivas de Bootstrap al nuevo elemento creado
        nuevaTarjeta.className = "col-md-6 col-lg-4 mb-3 item-envio";

        // Estructura interna de la tarjeta de Bootstrap usando el contenido del formulario
        nuevaTarjeta.innerHTML = `
            <div class="card h-100 shadow-sm border-start border-primary border-4">
                <div class="card-body">
                    <span class="badge bg-secondary mb-2">${categoria}</span>
                    <h5 class="card-title fw-bold">${cliente}</h5>
                    <p class="card-text text-muted small">${descripcion}</p>
                    <button class="btn btn-danger btn-sm btn-eliminar fw-bold w-100 mt-2">
                        ❌ Eliminar Registro
                    </button>
                </div>
            </div>
        `;

        // 5. Agregar el nuevo elemento a la página con appendChild() (Requisito obligatorio)
        listaEnvios.appendChild(nuevaTarjeta);

        // 6. Actualizar y mostrar el total de registros en pantalla
        totalEnvios++;
        totalEnviosElemento.textContent = totalEnvios;

        // 7. Mostrar mensaje dinámico de éxito al usuario
        mensajeValidacion.className = "alert alert-success mt-3";
        mensajeValidacion.textContent = "✅ ¡Envío registrado con éxito en el sistema SIGL!";
        mensajeValidacion.classList.remove("d-none");

        // Limpiar los campos del formulario para un nuevo ingreso
        formularioEnvio.reset();

        // 8. Funcionalidad para eliminar un registro específico mediante el botón
        const botonEliminar = nuevaTarjeta.querySelector(".btn-eliminar");
        botonEliminar.addEventListener("click", function() {
            // Elimina la tarjeta del DOM
            nuevaTarjeta.remove();
            
            // Resta uno al contador total y lo actualiza en la pantalla
            totalEnvios--;
            totalEnviosElemento.textContent = totalEnvios;

            // Mostrar aviso dinámico de eliminación
            mensajeValidacion.className = "alert alert-warning mt-3";
            mensajeValidacion.textContent = "🗑️ Registro de envío eliminado correctamente.";
            mensajeValidacion.classList.remove("d-none");
        });
    });
});