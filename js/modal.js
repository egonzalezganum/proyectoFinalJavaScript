const carritoAbrir = document.getElementById('boton-carrito');
carritoAbrir.addEventListener('click', () => {
    contenedorModal.classList.toggle('modal-active')
})

const carritoCerrar = document.getElementById('carritoCerrar');
carritoCerrar.addEventListener('click', () => {
    contenedorModal.classList.toggle('modal-active')
})

const modalCarrito = document.getElementsByClassName('modal-carrito')[0]
modalCarrito.addEventListener('click', (e) => {
    e.stopPropagation()
})

const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
contenedorModal.addEventListener('click', () => {
    carritoCerrar.click()
})

