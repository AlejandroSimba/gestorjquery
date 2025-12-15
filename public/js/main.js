$(document).ready(function() {
    //Array de objetos productos
    let productos = [];
    
    // FUNCIONES PARA LISTAR
    //Función para renderizar la tabla de productos
    function renderizarTabla() {
        // CORREGIDO: El ID en tu HTML es productTableBody (con B mayúscula)
        const tbody = $('#productTableBody');
        const emptyMessage = $('#emptyTableMessage'); 
        // CORREGIDO: El ID en tu HTML es productCount
        const counBadge = $('#productCount');

        //Limpiar el contenido actual de la tabla
        tbody.find('tr:not(#emptyTableMessage)').remove();

        //Actualizamos el contador de productos
        counBadge.text(`${productos.length} productos`);

        //Verificamos si hay productos para mostrar
        if (productos.length === 0) {
            emptyMessage.show();
        } else {
            emptyMessage.hide();
        
            //Recorrer el array de productos y crear filas en la tabla
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
                
                // CORREGIDO: Aquí decías "fila", pero la variable de arriba es "nuevaFila"
                tbody.append(nuevaFila);
            });
        }
    }

    // FUNCIONES PARA AGREGAR
    //Función para agregar un nuevo producto
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
        renderizarTabla();
        
        $('#productForm')[0].reset();
        $('#productName').focus();

        Swal.fire({
            icon: 'success',
            title: '¡Producto Agregado!',
            text: `${nombre} se ha guardado correctamente.`,
            timer: 2000,
            showConfirmButton: false
        });
    });

    renderizarTabla();
});