document.addEventListener("DOMContentLoaded", function() {
    
    // Referencias al DOM
    const formulario = document.getElementById("form-registro-envio");
    const inputCliente = document.getElementById("clienteEnvio");
    const inputDescripcion = document.getElementById("descripcionEnvio");
    const selectCategoria = document.getElementById("categoriaEnvio");
    const listaEnvios = document.getElementById("lista-envios");
    const totalEnviosElemento = document.getElementById("total-envios");
    const mensajeValidacion = document.getElementById("mensaje-validacion");

    // Arreglo de objetos para representar los datos
    let datosEnvios = [
        { id: 1, cliente: "Distribuidora Andina", descripcion: "Lote de suministros médicos", categoria: "Urgente" },
        { id: 2, cliente: "Tech Store Ecuador", descripcion: "Paleta de componentes de PC", categoria: "Estándar" }
    ];

    // --- FUNCIONES DE RENDERIZADO DINÁMICO --- //
    const renderizarDatos = () => {
        // Limpiamos el contenedor
        listaEnvios.innerHTML = "";
        
        // Condición para mostrar estado vacío
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

        // Estructura repetitiva
        datosEnvios.forEach((envio) => {
            let colorBorde = "border-success";
            if (envio.categoria === "Urgente") colorBorde = "border-danger";
            else if (envio.categoria === "Internacional") colorBorde = "border-warning";

            const nuevaTarjeta = document.createElement("div");
            nuevaTarjeta.className = "col-md-6 col-lg-6 mb-3 item-envio";
            nuevaTarjeta.innerHTML = `
                <div class="card h-100 shadow-sm border-start ${colorBorde} border-4">
                    <div class="card-body">
                        <span class="badge bg-secondary mb-2">${envio.categoria}</span>
                        <h5 class="card-title fw-bold">${envio.cliente}</h5>
                        <p class="card-text text-muted small">${envio.descripcion}</p>
                        <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar fw-bold w-100 mt-2">
                            ❌ Eliminar
                        </button>
                    </div>
                </div>
            `;
            
            // Asignación de evento limpia (evita advertencias del editor)
            nuevaTarjeta.querySelector('.btn-eliminar').addEventListener('click', () => {
                datosEnvios = datosEnvios.filter(e => e.id !== envio.id);
                renderizarDatos();
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

    // --- EVENTO SUBMIT --- //
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const clienteValido = comprobarCliente();
        const descripcionValida = comprobarDescripcion();
        const categoriaValida = comprobarCategoria();

        if (clienteValido && descripcionValida && categoriaValida) {
            mensajeValidacion.classList.add("d-none");

            const nuevoId = datosEnvios.length > 0 ? Math.max(...datosEnvios.map(e => e.id)) + 1 : 1;
            
            datosEnvios.push({
                id: nuevoId,
                cliente: inputCliente.value.trim(),
                descripcion: inputDescripcion.value.trim(),
                categoria: selectCategoria.value
            });

            renderizarDatos();

            mensajeValidacion.className = "alert alert-success mt-3";
            mensajeValidacion.textContent = "✅ ¡Registro validado y guardado correctamente!";
            mensajeValidacion.classList.remove("d-none");

            formulario.reset();
            [inputCliente, inputDescripcion, selectCategoria].forEach(el => el.classList.remove("is-valid", "is-invalid"));

        } else {
            mensajeValidacion.className = "alert alert-danger mt-3";
            mensajeValidacion.textContent = "⚠️ Error: Por favor, corrija los campos antes de continuar.";
            mensajeValidacion.classList.remove("d-none");
        }
    });

    // Pintar los datos al cargar
    renderizarDatos();
});