$(document).ready(function() {
    
    // ======================================================
    // ZONA 1: CÓDIGO COMÚN Y DE TU COMPAÑERO (NO TOCAR)
    // ======================================================
    
    // Array global de productos
    let productos = [];

    // --- FUNCIÓN DE TU COMPAÑERO (INTACTA) ---
    // Esta función solo sabe mostrar TODOS los productos.
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
            // Bucle original de tu compañero
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

    // --- AGREGAR PRODUCTO (INTACTO) ---
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

        // AQUÍ LLAMA A LA FUNCIÓN DE TU COMPAÑERO (Muestra todos)
        renderizarTabla(); 

        Swal.fire({ icon: 'success', title: 'Agregado', timer: 1500, showConfirmButton: false });
    });


    // 
    // APORTE EVELYN 
    // 

    // 1. FUNCIÓN DE RENDERIZADO
    // lista como parámetro
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
            
            // Usamos la lista filtrada 
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

        // IMPORTANTE: Aquí llamamos a la funcion
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
        // 
        renderizarTablaEvelyn(productos); 
    });

    // Carga inicial
    renderizarTabla();
});