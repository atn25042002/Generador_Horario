var campo = `
<label for="docente">Docente:</label>
<input type="text" name="docente" placeholder="Nombre del docente" required>

<label for="aula">Aula:</label>
<input type="text" name="aula" placeholder="Nombre del aula" required>

<label for="preferencia">Preferencia:</label>
<input type="checkbox" name="preferencia">
`;

var Choras= [];
var horas=[];
var turnoactual= 0;

//<div class="curso">

document.addEventListener("DOMContentLoaded", function() {
    agregarTurno();
    generarBloquesFunc();
    cargarHorario(0);
});

window.addEventListener('beforeunload', function () {
    // Tu código aquí para guardar algo en el LocalStorage justo antes de cerrar la página.
    //localStorage.setItem('cursos', JSON.stringify(cursos));
})

function regresar(){
    window.location.href = "../index.html";
}

function guardarHorario(turno){
    
}

function cargarHorario(turno){
    //let anterior = Choras[turnoactual];
    Choras[turnoactual]= [...horas];
    let copiahoras= [...horas];
    copiahoras.forEach(function(hora){
        quitarhora(hora);
    });
    document.getElementsByClassName('turno')[turnoactual].style= "";
    turnoactual= turno;
    document.getElementsByClassName('turno')[turno].style.backgroundColor = "yellow";
    let nuevos = Choras[turno];
    nuevos.forEach(function(hora){
        agregarhora(hora);
    });
}

function agregarTurno(){
    let campos= document.getElementById('turno-form');
    let curso= document.createElement('form');
    curso.innerHTML= campo;
    curso.className= "turno";
    let btn= document.createElement("button");
    btn.textContent="Modificar Horario";
    btn.id= "btn" + (Choras.length);
    btn.type= "button";
    btn.onclick = function () {
        cargarHorario(this.id.substring(3));
    };
    curso.appendChild(btn);
    Choras.push([]);
    campos.appendChild(curso);
}

function agregarhora(hora){
    let zona= document.getElementById('hora' + hora);
    zona.style.backgroundColor = "blue";
    horas.push(hora);
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

function guardarCurso(){
    //datosCurso y turno
    cargarHorario(turnoactual);
    let formcurso= document.getElementById('datosCurso');    
    if(formcurso.nombre.value == ""){
        window.alert("Ingrese nombre del curso");
        return;
    }
    let Cturnos= Array.from(document.getElementsByClassName('turno'));
    let Caulas= [];
    let Cdocentes = [];
    let Crestricciones= [];
    for(let i= 0; i< Cturnos.length; i++){
        let turno = Cturnos[i];
        if(turno.docente.value == "" || turno.aula.value == ""){
            document.getElementById("btn" + i).click();
            window.alert("Complete los datos de este turno"); 
            return;
        }
        if(Choras[i].length == 0){
            document.getElementById("btn" + i).click();
            window.alert("Cargue los horarios de este turno");            
            return;
        }
        Cdocentes.push(turno.docente.value);
        Caulas.push(turno.aula.value);
        if(turno.preferencia.checked){
            Crestricciones.push(i);
        }
    }
    c= new Curso(formcurso.nombre.value,Caulas,Choras,Cdocentes,formcurso.obligatorio.checked);
    c.preferencias= [...Crestricciones];
    console.log(c);
    //cursos.push(new Curso("Sistemas Operativos", ["306","306","306"], [[27,32,14,19],[51,56,44,49],[37,42,24,29]],["Karim","Aceituno","Karim"], true));
}