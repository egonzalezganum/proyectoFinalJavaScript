// estilo navbar cuando desplaza hacia abajo
window.onscroll = function () { myFunction() };
function myFunction() {
    var navbar = document.getElementById("myNavbar");

    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    } else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}

//opciones del menu en pantallas chicas
function toggleFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

let carritoDeCompras = []
let stockServicios = []
let arrayUsuarios = []

const contenedorServicios = document.getElementById('contenedor-servicios');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const botonTerminar = document.getElementById('terminar')
const finCompra = document.getElementById('fin-compra')

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

const filtroCategorias = document.getElementById('filtroCategorias')//OK
const buscador = document.getElementById('search')

const compra = document.querySelector("#seccion-compra")

//importo archivo json
fetch('js/servicios.json')
    .then((response) => response.json())
    .then((data) => {
        data.forEach(el => {
            stockServicios.push(el)
        })
        mostrarServicios(data)
        recuperar()
    });


//filtro por categorias
filtroCategorias.addEventListener('change', () => {
    if (filtroCategorias.value == 'all') {
        mostrarServicios(stockServicios)
    } else {
        mostrarServicios(stockServicios.filter(elemento => elemento.tipo == filtroCategorias.value))
    }
})

//recorro el array y muestro los servicios en el dom
function mostrarServicios(array) {
    contenedorServicios.innerHTML = '';
    array.forEach(item => {
        let div = document.createElement('div')
        div.classList.add('servicio')
        div.innerHTML += `
                            <div class="card mb-3" style="max-width: 990px;">
                                <div class="row g-0">
                                    <div class="col-md-4">
                                        <img src="${item.img}" class="img-fluid rounded-start" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">${item.nombre}</h5>
                                            <p class="card-text">${item.desc}</p>
                                            <p class="card-text">Precio por persona: $${item.precio}<small class="text-muted"></small></p>
                                            <a id="agregar${item.id}"class="btn-floating halfway-fab waves-effect waves-light orange" ><i class="material-icons">luggage</i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>`

        contenedorServicios.appendChild(div)

        let btnAgregar = document.getElementById(`agregar${item.id}`)
        //muestro swal cdo agregan un servicio
        btnAgregar.addEventListener('click', () => {
            // console.log('holi');
            agregarAlCarrito(item.id)
            let timerInterval
            Swal.fire({
                toast: true,
                title: '¡Servicio agregado!',
                html: 'Esta ventana se cerrara en <b></b>.',
                timer: 600,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                }
            })
        })

    })
}

//agrego al carrito, verifico si antes de agregar ya esta el servicio o se incorpora 
function agregarAlCarrito(id) {
    let yaEsta = carritoDeCompras.find(item => item.id == id)
    if (yaEsta) {
        yaEsta.cantidad++
        document.getElementById(`Cantidad${yaEsta.id}`).innerHTML = ` <p id=Cantidad${yaEsta.id}>Cantidad:${yaEsta.cantidad}</p>`
        actualizarCarrito()
    } else {
        let servicioAgregar = stockServicios.find(elemento => elemento.id == id)

        servicioAgregar.cantidad = 1

        carritoDeCompras.push(servicioAgregar)

        actualizarCarrito()

        mostrarCarrito(servicioAgregar)
    }

    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))

}


// muestro el carrito
function mostrarCarrito(servicioAgregar) {

    let div = document.createElement('div')
    div.className = 'servicioEnCarrito'
    div.innerHTML = `
                      <p>${servicioAgregar.nombre}</p>
                      <p>Precio: $${servicioAgregar.precio}</p>
                      <p id="Cantidad${servicioAgregar.id}">Cantidad:${servicioAgregar.cantidad}</p>
                      <button id="eliminar${servicioAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`
    contenedorCarrito.appendChild(div)

    let btnEliminar = document.getElementById(`eliminar${servicioAgregar.id}`)

    btnEliminar.addEventListener('click', () => {
        if (servicioAgregar.cantidad == 1) {
            btnEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(item => item.id != servicioAgregar.id)
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        } else {
            servicioAgregar.cantidad--
            document.getElementById(`Cantidad${servicioAgregar.id}`).innerHTML = ` <p id=Cantidad${servicioAgregar.id}>Cantidad:${servicioAgregar.cantidad}</p>`
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        }
        Toastify({
            text: "Servicio eliminado",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "middle",
            position: "right",
            stopOnFocus: false,
            style: {
                background: "linear-gradient(to right, #f19f91, #ff0000 )",
            },
            onClick: function () { } // Callback after click
        }).showToast();

    })

}

function actualizarCarrito() {
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el) => acc + el.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce((acc, el) => acc + (el.precio * el.cantidad), 0)
}


function recuperar() {
    let recuperarLS = JSON.parse(localStorage.getItem('carrito'))

    if (recuperarLS) {
        recuperarLS.forEach(el => {
            mostrarCarrito(el)
            carritoDeCompras.push(el)
            actualizarCarrito()
        })
    }
}


const abrirPagar = document.querySelector("#btn-pagar");
abrirPagar.addEventListener('click', () => {

    if (carritoDeCompras == 0) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Su carrito esta vacio',
            text: 'Agregue servicios antes de pagar',
            showConfirmButton: true,
        })
    } else {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Su pago fue realizado con exito',
            text: 'Actualice la página para resetear el carrito',
            showConfirmButton: true,
        })

        for (let i = carritoDeCompras.length; i > 0; i--) {
            carritoDeCompras.pop();
            actualizarCarrito();
            localStorage.clear();
        }
    }


});


const contacto = document.querySelector("#enviar-contacto");
contacto.addEventListener('click', (e) => {
    e.preventDefault();
});

const loginForm = document.querySelector("#login-submit");
loginForm.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Inició sesión");
});


const registroForm = document.querySelector("#registro-submit");
registroForm.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Se registró");
});
