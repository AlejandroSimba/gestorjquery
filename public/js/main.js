$(document).ready(function() {
    
    // Array global de productos
    let productos = [];

    // 
    // FUNCIÓN DE RENDERIZADO 
    // 
    function renderizarTabla(listaOpcional) {
        // Si hay una lista filtrada, usamos esa. Si no, usamos 'productos'
        const datosAMostrar = listaOpcional || productos;

        const tbody = $('#productTableBody');
        const emptyMessage = $('#emptyTableMessage'); 
        const countBadge = $('#productCount');

        // Limpiar contenido actual
        tbody.find('tr:not(#emptyTableMessage)').remove();

        // Actualizar contador
        countBadge.text(`${datosAMostrar.length} productos`);

        // Mostrar u ocultar mensaje de vacío
        if (datosAMostrar.length === 0) {
            emptyMessage.show();
        } else {
            emptyMessage.hide();
        
            // Recorrer el array y crear filas
            datosAMostrar.forEach(function(producto) {
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

    // ==========================================
    // FUNCIÓN AGREGAR (PUNTO 1)
    // ==========================================
    $('#productForm').on('submit', function(e) {
        e.preventDefault();

        const nombre = $('#productName').val().trim();
        const precio = parseFloat($('#productPrice').val());
        const categoria = $('#productCategory').val();

        if (nombre === '' || isNaN(precio) || precio <= 0 || categoria === null) {
            Swal.fire({
                icon: 'error',
                title: 'Datos incompletos',
                text: 'Por favor llena todos los campos correctamente.',
                confirmButtonColor: '#d33'
            });
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

        // Actualizamos la tabla (respetando filtros si existen)
        aplicarFiltros(); 

        Swal.fire({
            icon: 'success',
            title: '¡Producto Agregado!',
            text: `${nombre} se ha guardado correctamente.`,
            timer: 2000,
            showConfirmButton: false
        });
    });

    // =====================================================================
    // INICIO APORTE EVELYN CONDOY (Puntos 3, 4 y 5)
    // =====================================================================

    function aplicarFiltros() {
        // 1. Capturar valores de los inputs
        const categoriaFiltro = $('#filterCategory').val();
        const textoBusqueda = $('#searchProduct').val().toLowerCase();
        const ordenPrecio = $('#sortPrice').val();

        let resultados = [];

        // 2. Filtrado usando CICLOS y CONDICIONALES (Requisito Rúbrica)
        for (let i = 0; i < productos.length; i++) {
            let prod = productos[i];
            
            let cumpleCategoria = false;
            let cumpleBusqueda = false;

            // --- Punto 3: Filtro por Categoría ---
            if (categoriaFiltro === 'all') {
                cumpleCategoria = true;
            } else {
                if (prod.categoria === categoriaFiltro) {
                    cumpleCategoria = true;
                }
            }

            // --- Punto 4: Buscador en Vivo ---
            // Usamos indexOf para buscar texto parcial
            if (prod.nombre.toLowerCase().indexOf(textoBusqueda) !== -1) {
                cumpleBusqueda = true;
            }

            // Solo agregamos si cumple AMBAS condiciones
            if (cumpleCategoria === true && cumpleBusqueda === true) {
                resultados.push(prod);
            }
        }

        // --- Punto 5: Ordenamiento por Precio ---
        if (ordenPrecio !== '') {
            if (ordenPrecio === 'asc') {
                resultados.sort(function(a, b) {
                    return a.precio - b.precio;
                });
            } else if (ordenPrecio === 'desc') {
                resultados.sort(function(a, b) {
                    return b.precio - a.precio;
                });
            }
        }

        // Renderizamos la tabla con la lista filtrada y ordenada
        renderizarTabla(resultados);
    }

    // --- EVENTOS (Listeners) ---

    // Evento Change para Categoría
    $('#filterCategory').on('change', function() {
        aplicarFiltros();
    });

    // Evento Keyup para Buscador
    $('#searchProduct').on('keyup', function() {
        aplicarFiltros();
    });

    // Evento Change para Ordenar
    $('#sortPrice').on('change', function() {
        aplicarFiltros();
    });

    // Funcionalidad extra: Limpiar todo
    $('#clearAll').on('click', function() {
        $('#filterCategory').val('all');
        $('#searchProduct').val('');
        $('#sortPrice').val('');
        aplicarFiltros();
    });

    // =====================================================================
    // FIN APORTE EVELYN CONDOY
    // =====================================================================

    // Carga inicial
    renderizarTabla();
});