document.addEventListener("DOMContentLoaded", function() {
    
    // Referencias al DOM
    const formulario = document.getElementById("form-registro-envio");
    const inputCliente = document.getElementById("clienteEnvio");
    const inputDescripcion = document.getElementById("descripcionEnvio");
    const selectCategoria = document.getElementById("categoriaEnvio");
    const listaEnvios = document.getElementById("lista-envios");
    const totalEnviosElemento = document.getElementById("total-envios");
    const mensajeValidacion = document.getElementById("mensaje-validacion");

    // Elementos del botón para el Spinner (Semana 8)
    const btnSpinner = document.getElementById("spinner-carga");
    const btnTexto = document.getElementById("texto-btn");
    const btnSubmit = document.getElementById("btn-submit");

    // Arreglo de objetos simulando BD
    let datosEnvios = [
        { id: 1, cliente: "Distribuidora Andina", descripcion: "Lote de suministros médicos", categoria: "Urgente" },
        { id: 2, cliente: "Tech Store Ecuador", descripcion: "Paleta de componentes de PC", categoria: "Estándar" }
    ];

    // --- FUNCIONES DE RENDERIZADO DINÁMICO --- //
    const renderizarDatos = () => {
        listaEnvios.innerHTML = "";
        
        if (datosEnvios.length === 0) {
            listaEnvios.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-secondary text-center">
                        📭 No hay envíos registrados en el sistema actualmente.
                    </div>
                </div>`;
            totalEnviosElemento.textContent = "0";
            return;
        }

        totalEnviosElemento.textContent = datosEnvios.length;

        datosEnvios.forEach((envio) => {
            let colorBorde = "border-success";
            if (envio.categoria === "Urgente") colorBorde = "border-danger";
            else if (envio.categoria === "Internacional") colorBorde = "border-warning";

            const nuevaTarjeta = document.createElement("div");
            nuevaTarjeta.className = "col-md-6 col-lg-6 mb-3 item-envio";
            
            // Tarjetas mejoradas con nuevos botones (Semana 8)
            nuevaTarjeta.innerHTML = `
                <div class="card h-100 shadow-sm border-start ${colorBorde} border-4">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-secondary mb-2 align-self-start">${envio.categoria}</span>
                        <h5 class="card-title fw-bold">${envio.cliente}</h5>
                        <p class="card-text text-muted small flex-grow-1">${envio.descripcion}</p>
                        
                        <div class="d-flex gap-2 mt-3">
                            <button type="button" class="btn btn-outline-info btn-sm fw-bold flex-fill btn-detalles">
                                🔍 Detalles
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm fw-bold flex-fill btn-eliminar">
                                ❌ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Lógica para Eliminar sin usar onclick en el HTML (Mejor práctica)
            nuevaTarjeta.querySelector('.btn-eliminar').addEventListener('click', () => {
                datosEnvios = datosEnvios.filter(e => e.id !== envio.id);
                renderizarDatos();
            });

            // Lógica para Modal de Detalles (Semana 8)
            nuevaTarjeta.querySelector('.btn-detalles').addEventListener('click', () => {
                const modalBody = document.getElementById("modal-body-content");
                modalBody.innerHTML = `
                    <p class="mb-2"><strong>ID de Rastreo:</strong> <span class="text-primary fw-bold">#000${envio.id}</span></p>
                    <p class="mb-2"><strong>Cliente:</strong> ${envio.cliente}</p>
                    <p class="mb-2"><strong>Descripción de Carga:</strong> ${envio.descripcion}</p>
                    <p class="mb-0"><strong>Categoría:</strong> <span class="badge bg-secondary">${envio.categoria}</span></p>
                `;
                
                const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
                modal.show();
            });

            listaEnvios.appendChild(nuevaTarjeta);
        });
    };

    // --- FUNCIONES DE VALIDACIÓN --- //
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

    const comprobarCliente = () => validarCampo(inputCliente, inputCliente.value.trim().length >= 3);
    const comprobarDescripcion = () => validarCampo(inputDescripcion, inputDescripcion.value.trim().length >= 10);
    const comprobarCategoria = () => validarCampo(selectCategoria, selectCategoria.value !== "");

    [inputCliente, inputDescripcion, selectCategoria].forEach(elemento => {
        elemento.addEventListener("input", function() {
            if (this.id === "clienteEnvio") comprobarCliente();
            if (this.id === "descripcionEnvio") comprobarDescripcion();
            if (this.id === "categoriaEnvio") comprobarCategoria();
        });
    });

    // --- EVENTO SUBMIT (Actualizado con Spinner Semana 8) --- //
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const clienteValido = comprobarCliente();
        const descripcionValida = comprobarDescripcion();
        const categoriaValida = comprobarCategoria();

        if (clienteValido && descripcionValida && categoriaValida) {
            mensajeValidacion.classList.add("d-none");

            // Activar estado de carga en el botón
            btnSpinner.classList.remove("d-none");
            btnTexto.textContent = " Procesando...";
            btnSubmit.disabled = true;

            // Simular un tiempo de procesamiento en servidor de 1.5 segundos
            setTimeout(() => {
                const nuevoId = datosEnvios.length > 0 ? Math.max(...datosEnvios.map(e => e.id)) + 1 : 1;
                
                datosEnvios.push({
                    id: nuevoId,
                    cliente: inputCliente.value.trim(),
                    descripcion: inputDescripcion.value.trim(),
                    categoria: selectCategoria.value
                });

                renderizarDatos();

                mensajeValidacion.className = "alert alert-success mt-3 shadow-sm";
                mensajeValidacion.innerHTML = "<strong>✅ Éxito:</strong> ¡Registro guardado correctamente!";
                mensajeValidacion.classList.remove("d-none");

                formulario.reset();
                [inputCliente, inputDescripcion, selectCategoria].forEach(el => el.classList.remove("is-valid", "is-invalid"));

                // Restaurar el botón a la normalidad
                btnSpinner.classList.add("d-none");
                btnTexto.textContent = "Registrar en Sistema";
                btnSubmit.disabled = false;

            }, 1200); // 1200 ms = 1.2 segundos

        } else {
            mensajeValidacion.className = "alert alert-danger mt-3 shadow-sm";
            mensajeValidacion.innerHTML = "<strong>⚠️ Error:</strong> Por favor, corrija los campos marcados.";
            mensajeValidacion.classList.remove("d-none");
        }
    });

    // Pintar los datos iniciales al cargar
    renderizarDatos();
});