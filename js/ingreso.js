var campo = `
<label for="docente">Docente:</label>
<input type="text" name="docente" placeholder="Nombre del docente" required>

<label for="aula">Aula:</label>
<input type="text" name="aula" placeholder="Nombre del aula" required>

<label for="obligatorio">Obligatorio:</label>
<input type="checkbox" name="obligatorio">
`;

var horas=[];

//<div class="curso">

document.addEventListener("DOMContentLoaded", function() {
    agregarTurno();
    generarBloquesFunc();
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

function agregarhora(hora){
    let zona= document.getElementById('hora' + hora);
    zona.style.backgroundColor = "blue";
    horas.push(hora);
    console.log(horas);
    zona.onclick = function () {
        quitarhora(hora);
    };
}

function quitarhora(hora){
    let zona= document.getElementById('hora' + hora);
    zona.style= '';
    const index = horas.indexOf(hora);
    if (index !== -1) {
        horas.splice(index, 1);
    }
    console.log(horas);
    zona.onclick = function () {
        agregarhora(hora);
    };    
}

function generarBloquesFunc(){
    //Genera el horario con dias y horas vacios
    let tableBody = document.querySelector("#horarioTable tbody");
    let sum= 0;
    let n= 0;
    intervalosHorarios.forEach(function(intervalo) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.textContent = intervalo;
        row.appendChild(cell);
        for (var i = 0; i < 5; i++) {
            cell = document.createElement("td");
            n= i + 1 + sum;
            cell.id= "hora" + n;
            //cell.setAttribute('onclick',"agregarhora(" + n + ")");
            cell.onclick = function () {
                agregarhora(this.id.substring(4));
            };
            //cell.textContent = "Clase " + n;
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
        sum+=5;
    });
}