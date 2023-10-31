document.addEventListener("DOMContentLoaded", function() {
    generarBloques();
});

window.addEventListener('beforeunload', function () {
    // Tu código aquí para guardar algo en el LocalStorage justo antes de cerrar la página.
    //localStorage.setItem('cursos', JSON.stringify(cursos));
})