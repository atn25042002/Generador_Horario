var campo = `
<label for="docente">Docente:</label>
<input type="text" name="docente" placeholder="Nombre del docente" required>

<label for="aula">Aula:</label>
<input type="text" name="aula" placeholder="Nombre del aula" required>

<label for="obligatorio">Obligatorio:</label>
<input type="checkbox" name="obligatorio">
`;

//<div class="curso">

document.addEventListener("DOMContentLoaded", function() {
    agregarTurno();
    generarBloques();
});

window.addEventListener('beforeunload', function () {
    // Tu código aquí para guardar algo en el LocalStorage justo antes de cerrar la página.
    //localStorage.setItem('cursos', JSON.stringify(cursos));
})

function agregarTurno(){
    let campos= document.getElementById('turno-form');
    let curso= document.createElement('form');
    curso.innerHTML= campo;
    curso.className= "turno";
    campos.appendChild(curso);
}