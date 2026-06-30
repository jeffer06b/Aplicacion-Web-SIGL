document.addEventListener("DOMContentLoaded", function() {
    
    // Referencias al DOM
    const formulario = document.getElementById("form-registro-envio");
    const inputCliente = document.getElementById("clienteEnvio");
    const inputDescripcion = document.getElementById("descripcionEnvio");
    const selectCategoria = document.getElementById("categoriaEnvio");
    const listaEnvios = document.getElementById("lista-envios");
    const totalEnviosElemento = document.getElementById("total-envios");
    const mensajeValidacion = document.getElementById("mensaje-validacion");

    let totalEnvios = 0;

    // --- FUNCIONES DE VALIDACIÓN REUTILIZABLES --- //
    
    // Función genérica que aplica las clases de Bootstrap según la condición
    const validarCampo = (elemento, esValido) => {
        if (esValido) {
            elemento.classList.remove("is-invalid");
            elemento.classList.add("is-valid");
        } else {
            elemento.classList.remove("is-valid");
            elemento.classList.add("is-invalid");
        }
        return esValido;
    };

    // Funciones específicas con las reglas del profesor
    const comprobarCliente = () => validarCampo(inputCliente, inputCliente.value.trim().length >= 3);
    const comprobarDescripcion = () => validarCampo(inputDescripcion, inputDescripcion.value.trim().length >= 10);
    const comprobarCategoria = () => validarCampo(selectCategoria, selectCategoria.value !== "");

    // --- EVENTOS EN TIEMPO REAL (input y blur) --- //
    // Valida mientras el usuario escribe o cuando quita el clic del campo
    [inputCliente, inputDescripcion, selectCategoria].forEach(elemento => {
        elemento.addEventListener("input", function() {
            if (this.id === "clienteEnvio") comprobarCliente();
            if (this.id === "descripcionEnvio") comprobarDescripcion();
            if (this.id === "categoriaEnvio") comprobarCategoria();
        });
        
        elemento.addEventListener("blur", function() {
            if (this.id === "clienteEnvio") comprobarCliente();
            if (this.id === "descripcionEnvio") comprobarDescripcion();
            if (this.id === "categoriaEnvio") comprobarCategoria();
        });
    });

    // --- EVENTO SUBMIT (Envío del formulario) --- //
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault(); // Evita que recargue la página

        // Ejecutar todas las validaciones al dar clic en enviar
        const clienteValido = comprobarCliente();
        const descripcionValida = comprobarDescripcion();
        const categoriaValida = comprobarCategoria();

        // Verificar si TODOS los campos son correctos
        if (clienteValido && descripcionValida && categoriaValida) {
            
            // Ocultar alertas de error previas
            mensajeValidacion.classList.add("d-none");

            // Crear el registro dinámico (Semana 5)
            const nuevaTarjeta = document.createElement("div");
            nuevaTarjeta.className = "col-md-6 col-lg-4 mb-3 item-envio";
            nuevaTarjeta.innerHTML = `
                <div class="card h-100 shadow-sm border-start border-success border-4">
                    <div class="card-body">
                        <span class="badge bg-secondary mb-2">${selectCategoria.value}</span>
                        <h5 class="card-title fw-bold">${inputCliente.value.trim()}</h5>
                        <p class="card-text text-muted small">${inputDescripcion.value.trim()}</p>
                        <button class="btn btn-outline-danger btn-sm btn-eliminar fw-bold w-100 mt-2">
                            ❌ Eliminar
                        </button>
                    </div>
                </div>
            `;

            listaEnvios.appendChild(nuevaTarjeta);

            // Actualizar contador
            totalEnvios++;
            totalEnviosElemento.textContent = totalEnvios;

            // Mostrar mensaje de éxito global
            mensajeValidacion.className = "alert alert-success mt-3";
            mensajeValidacion.textContent = "✅ ¡Registro validado y guardado correctamente!";
            mensajeValidacion.classList.remove("d-none");

            // Limpiar formulario y resetear clases de validación
            formulario.reset();
            [inputCliente, inputDescripcion, selectCategoria].forEach(el => {
                el.classList.remove("is-valid", "is-invalid");
            });

            // Lógica para eliminar el registro creado
            nuevaTarjeta.querySelector(".btn-eliminar").addEventListener("click", function() {
                nuevaTarjeta.remove();
                totalEnvios--;
                totalEnviosElemento.textContent = totalEnvios;
            });

        } else {
            // Mostrar mensaje de error global si falta algo
            mensajeValidacion.className = "alert alert-danger mt-3";
            mensajeValidacion.textContent = "⚠️ Error: Por favor, corrija los campos marcados en rojo antes de continuar.";
            mensajeValidacion.classList.remove("d-none");
        }
    });
});