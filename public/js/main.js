$(document).ready(function() {
    
    // ==========================================
    // VARIABLES Y FUNCIONES GLOBALES
    // ==========================================
    
    let productos = [];

    /**
     * Función básica de renderizado (para mostrar todo)
     */
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

    /**
     * Renderiza la tabla basada en una lista filtrada (Lógica de Evelyn)
     */
    function renderizarTablaEvelyn(listaFiltrada) {
        const tbody = $('#productTableBody');
        const emptyMessage = $('#emptyTableMessage'); 
        const countBadge = $('#productCount');

        // Limpiamos la tabla
        tbody.find('tr:not(#emptyTableMessage)').remove();
        
        // Actualizamos contador con la lista filtrada
        countBadge.text(`${listaFiltrada.length} productos`);

        if (listaFiltrada.length === 0) {
            emptyMessage.show();
        } else {
            emptyMessage.hide();
            
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

    /**
     * Aplica filtros de Categoría, Búsqueda y Ordenamiento
     */
    function aplicarFiltrosEvelyn() {
        const cat = $('#filterCategory').val();
        const busqueda = $('#searchProduct').val().toLowerCase();
        const orden = $('#sortPrice').val();

        let resultados = [];

        // Ciclo FOR y IF (Requisito Rúbrica)
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

        renderizarTablaEvelyn(resultados);
    }

    // ==========================================
    // EVENTOS DEL DOM
    // ==========================================

    // 1. AGREGAR PRODUCTO
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

        // Aplicar filtros inmediatamente para ver si el nuevo producto cumple los criterios
        aplicarFiltrosEvelyn();

        Swal.fire({ icon: 'success', title: 'Agregado', timer: 1500, showConfirmButton: false });
    });

    // 2. ELIMINAR PRODUCTO
    $(document).on('click', '.btn-eliminar', function() {
        const id = $(this).data('id').toString();
        // Eliminamos del array
        productos = productos.filter(p => p.id !== id);
        // Re-renderizamos manteniendo filtros
        aplicarFiltrosEvelyn();
        
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        Toast.fire({ icon: 'success', title: 'Producto eliminado' });
    });

    // 3. EVENTOS DE FILTROS
    $('#filterCategory').on('change', function() { aplicarFiltrosEvelyn(); });
    $('#searchProduct').on('keyup', function() { aplicarFiltrosEvelyn(); });
    $('#sortPrice').on('change', function() { aplicarFiltrosEvelyn(); });

    // 4. LIMPIAR FILTROS
    $('#clearAll').on('click', function() {
        $('#filterCategory').val('all');
        $('#searchProduct').val('');
        $('#sortPrice').val('');
        
        renderizarTablaEvelyn(productos); 
    });

    // ==========================================
    // ESTADÍSTICAS (Total, Promedio, Max, Min)
    // ==========================================

    $('#showStats').on('click', function () {
        const $stats = $('#statsContent');

        // 1. Validar si está vacío
        if (productos.length === 0) {
            $stats.html(`<div class="alert alert-secondary mb-0">No hay productos registrados para calcular.</div>`);
            return;
        }

        // 2. Variables iniciales
        let total = 0;
        let sumaPrecios = 0;
        let maxProducto = productos[0];
        let minProducto = productos[0];

        // 3. Ciclo para calcular (Lógica algorítmica)
        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];
            
            // Contadores
            total++;
            sumaPrecios += p.precio;

            // Comparar Máximo
            if (p.precio > maxProducto.precio) {
                maxProducto = p;
            }

            // Comparar Mínimo
            if (p.precio < minProducto.precio) {
                minProducto = p;
            }
        }

        // 4. Calcular promedio
        const promedio = sumaPrecios / total;

        // 5. Renderizar HTML con los resultados
        $stats.html(`
            <div class="row g-2 text-start">
                <div class="col-6">
                    <div class="p-2 border rounded bg-light h-100">
                        <small class="text-muted fw-bold d-block">TOTAL</small>
                        <span class="fs-5">${total} items</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-2 border rounded bg-light h-100">
                        <small class="text-muted fw-bold d-block">PROMEDIO</small>
                        <span class="fs-5">$${promedio.toFixed(2)}</span>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-2 border rounded bg-light border-success bg-opacity-10">
                        <small class="text-success fw-bold d-block"><i class="fas fa-arrow-up"></i> MÁS CARO</small>
                        <div>${maxProducto.nombre} ($${maxProducto.precio.toFixed(2)})</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-2 border rounded bg-light border-primary bg-opacity-10">
                        <small class="text-primary fw-bold d-block"><i class="fas fa-arrow-down"></i> MÁS BARATO</small>
                        <div>${minProducto.nombre} ($${minProducto.precio.toFixed(2)})</div>
                    </div>
                </div>
            </div>
        `);
    });

    // ==========================================
    // MODO OSCURO (Dark Mode)
    // ==========================================
    
    function activarModoOscuro() {
        $('body').addClass('dark-mode');
        // Cambiar icono a Sol y estilo del botón
        $('#toggleDarkMode').html('<i class="fas fa-sun"></i>').removeClass('btn-outline-light').addClass('btn-light');
        // Guardar en memoria del navegador
        localStorage.setItem('theme', 'dark');
    }

    function desactivarModoOscuro() {
        $('body').removeClass('dark-mode');
        // Cambiar icono a Luna y estilo del botón
        $('#toggleDarkMode').html('<i class="fas fa-moon"></i>').removeClass('btn-light').addClass('btn-outline-light');
        // Guardar en memoria
        localStorage.setItem('theme', 'light');
    }

    // A. Revisar preferencia guardada al cargar
    if (localStorage.getItem('theme') === 'dark') {
        activarModoOscuro();
    }

    // B. Evento del botón
    $('#toggleDarkMode').on('click', function() {
        if ($('body').hasClass('dark-mode')) {
            desactivarModoOscuro();
        } else {
            activarModoOscuro();
        }
    });

});