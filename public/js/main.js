$(document).ready(function() {

    // Array global de productos
    let productos = [];

    // ====== (AÑADIDO) Variables para eliminar con modal ======
    let idParaEliminar = null;
    const deleteModalEl = document.getElementById('deleteModal');
    const deleteModal = deleteModalEl ? new bootstrap.Modal(deleteModalEl) : null;

    // Muestra TODOS los productos.
    function renderizarTabla() {
        const tbody = $('#productTableBody');
        const emptyMessage = $('#emptyTableMessage'); 
        const countBadge = $('#productCount');

        // Limpieza básica
        tbody.find('tr:not(#emptyTableMessage)').remove();
        countBadge.text(`${productos.length} productos`);

        if (productos.length === 0) {
            emptyMessage.show();
        } else {
            emptyMessage.hide();
            // Bucle 
            productos.forEach(function(producto) {
                const precioFormateado = parseFloat(producto.precio).toFixed(2);
                const nuevaFila = `
                    <tr class="fade-in-row">
                        <td class="ps-4 fw-bold text-secondary">#${producto.id}</td>
                        <td><span class="fw-bold">${producto.nombre}</span></td>
                        <td><span class="badge bg-light text-dark border">$${precioFormateado}</span></td>
                        <td><span class="badge bg-info text-dark bg-opacity-25 border border-info">${producto.categoria}</span></td>
                        <td class="text-end pe-4">
                            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${producto.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(nuevaFila);
            });
        }
    }

    // --- AGREGAR PRODUCTO ---
    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        const nombre = $('#productName').val().trim();
        const precio = parseFloat($('#productPrice').val());
        const categoria = $('#productCategory').val();

        if (nombre === '' || isNaN(precio) || precio <= 0 || categoria === null) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Datos incompletos' });
            return;
        }

        const nuevoProducto = {
            id: Date.now().toString().slice(-4),
            nombre: nombre,
            precio: precio,
            categoria: categoria
        };

        productos.push(nuevoProducto);
        
        $('#productForm')[0].reset();
        $('#productName').focus();

        // LLAMAMOS A LA FUNCIÓN 
        renderizarTabla(); 

        Swal.fire({ icon: 'success', title: 'Agregado', timer: 1500, showConfirmButton: false });
    });


    //
    // EVELYN CONDOY 
    // 

    // 1. FUNCIÓN DE RENDERIZADO
    
    function renderizarTablaEvelyn(listaFiltrada) {
        const tbody = $('#productTableBody');
        const emptyMessage = $('#emptyTableMessage'); 
        const countBadge = $('#productCount');

        // Limpiamos la tabla
        tbody.find('tr:not(#emptyTableMessage)').remove();
        
        // Actualizamos contador 
        countBadge.text(`${listaFiltrada.length} productos`);

        if (listaFiltrada.length === 0) {
            emptyMessage.show();
        } else {
            emptyMessage.hide();
            
            // Usamos lista filtrada
            listaFiltrada.forEach(function(producto) {
                const precioFormateado = parseFloat(producto.precio).toFixed(2);
                const fila = `
                    <tr class="fade-in-row">
                        <td class="ps-4 fw-bold text-secondary">#${producto.id}</td>
                        <td><span class="fw-bold">${producto.nombre}</span></td>
                        <td><span class="badge bg-light text-dark border">$${precioFormateado}</span></td>
                        <td><span class="badge bg-info text-dark bg-opacity-25 border border-info">${producto.categoria}</span></td>
                        <td class="text-end pe-4">
                            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${producto.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(fila);
            });
        }
    }

    // 2. LÓGICA DE FILTROS
    function aplicarFiltrosEvelyn() {
        const cat = $('#filterCategory').val();
        const busqueda = $('#searchProduct').val().toLowerCase();
        const orden = $('#sortPrice').val();

        let resultados = [];

        // Ciclo FOR y IF 
        for (let i = 0; i < productos.length; i++) {
            let p = productos[i];
            let pasaCat = false;
            let pasaBus = false;

            // Filtro Categoría
            if (cat === 'all' || p.categoria === cat) {
                pasaCat = true;
            }

            // Filtro Buscador
            if (p.nombre.toLowerCase().indexOf(busqueda) !== -1) {
                pasaBus = true;
            }

            if (pasaCat && pasaBus) {
                resultados.push(p);
            }
        }

        // Ordenamiento
        if (orden === 'asc') {
            resultados.sort((a, b) => a.precio - b.precio);
        } else if (orden === 'desc') {
            resultados.sort((a, b) => b.precio - a.precio);
        }

        //  Aquí llamamos a la funcion
        renderizarTablaEvelyn(resultados);
    }

    // 3.  EVENTOS
    $('#filterCategory').on('change', function() { aplicarFiltrosEvelyn(); });
    $('#searchProduct').on('keyup', function() { aplicarFiltrosEvelyn(); });
    $('#sortPrice').on('change', function() { aplicarFiltrosEvelyn(); });

    $('#clearAll').on('click', function() {
        $('#filterCategory').val('all');
        $('#searchProduct').val('');
        $('#sortPrice').val('');
        
        renderizarTablaEvelyn(productos); 
    });

    // ====== (AÑADIDO) INCISO 6: ESTADÍSTICAS DEL SISTEMA ======
    $('#showStats').on('click', function() {
        const cont = $('#statsContent');

        if (productos.length === 0) {
            cont.html('<p class="text-muted">No hay productos registrados para calcular estadísticas.</p>');
            return;
        }

        // Cálculos con estructura iterativa (FOR)
        let total = 0;
        let suma = 0;

        let masCaro = productos[0];
        let masBarato = productos[0];

        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];
            total++;
            suma += p.precio;

            if (p.precio > masCaro.precio) masCaro = p;
            if (p.precio < masBarato.precio) masBarato = p;
        }

        const promedio = suma / total;

        cont.html(`
            <div class="row g-3">
                <div class="col-6">
                    <div class="p-3 border rounded bg-light">
                        <div class="fw-bold"><i class="fas fa-boxes me-1"></i>Total</div>
                        <div class="fs-4">${total}</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 border rounded bg-light">
                        <div class="fw-bold"><i class="fas fa-calculator me-1"></i>Promedio</div>
                        <div class="fs-4">$${promedio.toFixed(2)}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 border rounded bg-light text-start">
                        <div class="fw-bold"><i class="fas fa-arrow-up me-1"></i>Producto más caro</div>
                        <div>${masCaro.nombre} <span class="text-muted">(#${masCaro.id})</span> — <span class="fw-bold">$${masCaro.precio.toFixed(2)}</span></div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 border rounded bg-light text-start">
                        <div class="fw-bold"><i class="fas fa-arrow-down me-1"></i>Producto más barato</div>
                        <div>${masBarato.nombre} <span class="text-muted">(#${masBarato.id})</span> — <span class="fw-bold">$${masBarato.precio.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
        `);
    });

    // ====== (AÑADIDO) INCISO 7 (BONUS): ELIMINAR CON splice() ======
    // 1) Click en botón eliminar: abrir modal y guardar ID
    $(document).on('click', '.btn-eliminar', function() {
        const id = String($(this).data('id'));
        idParaEliminar = id;

        // Buscar nombre con ciclo FOR (sin métodos extra)
        let nombreEncontrado = '';
        for (let i = 0; i < productos.length; i++) {
            if (String(productos[i].id) === id) {
                nombreEncontrado = productos[i].nombre;
                break;
            }
        }

        $('#productToDeleteName').text(nombreEncontrado || 'este producto');

        if (deleteModal) {
            deleteModal.show();
        } else {
            // fallback por si no cargó bootstrap modal (raro)
            if (confirm('¿Eliminar el producto?')) {
                $('#confirmDelete').click();
            }
        }
    });

    // 2) Confirmar eliminación: splice() y actualizar tabla
    $('#confirmDelete').on('click', function() {
        if (idParaEliminar === null) return;

        // Buscar índice con FOR
        let index = -1;
        for (let i = 0; i < productos.length; i++) {
            if (String(productos[i].id) === String(idParaEliminar)) {
                index = i;
                break;
            }
        }

        if (index !== -1) {
            productos.splice(index, 1); // ✅ obligatorio
        }

        idParaEliminar = null;

        if (deleteModal) deleteModal.hide();

        // Actualizar tabla respetando filtros actuales
        aplicarFiltrosEvelyn();

        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1200, showConfirmButton: false });
    });

    // Carga inicial
    renderizarTabla();
});
