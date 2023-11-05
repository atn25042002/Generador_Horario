var campo = `
<label class="celda" for="docente">Docente:</label>
<input class="celda" type="text" name="docente" placeholder="Nombre del docente" required>

<label class="celda" for="aula">Aula:</label>
<input class="celda" type="text" name="aula" placeholder="Nombre del aula" required>

<label class="celda" for="preferencia">Preferencia:</label>
<input class="celda" type="checkbox" name="preferencia">
`;

var Choras= [];
var horas=[];
var turnoactual= 0;
var _indiceCurso;

//<div class="curso">

document.addEventListener("DOMContentLoaded", function() {    
    generarBloquesFunc();
    let url = new URL(window.location.href);
    let curso = url.searchParams.get("curso");
    if( curso != undefined){
        _indiceCurso= curso;
        editarCurso(curso);
        document.getElementById("btnguardar").setAttribute('onclick',"actualizarCurso()")
    }else{
        agregarTurno();
    }
    cargarHorario(0);
});

window.addEventListener('beforeunload', function () {
    // Tu código aquí para guardar algo en el LocalStorage justo antes de cerrar la página.
    //localStorage.setItem('cursos', JSON.stringify(cursos));
});

function editarCurso(indice){
    let formcurso= document.getElementById('datosCurso');
    let cursos= JSON.parse(localStorage.getItem('cursos'));
    let curso= cursos[indice];
    console.log(curso);
    formcurso.nombre.value= curso.nombre;
    formcurso.obligatorio.checked= curso.obligatorio;
    Choras= [...curso.horas];   
    horas= Choras[turnoactual];
    let nturnos= Choras.length; 
    
    for(let i= 0; i< nturnos; i++){
        agregarTurnoDatos(curso.docente[i], curso.aula[i], curso.preferencias.includes(i), i);
    }
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

function agregarTurnoDatos(docente, aula, preferencia, indice){
    console.log(indice);
    let campos= document.getElementById('listaTurnos');
    let curso= document.createElement('form');
    let nro= indice;
    curso.innerHTML= campo;
    curso.className= "turno";
    curso.docente.value= docente;
    curso.aula.value= aula;
    curso.preferencia.checked= preferencia;

    let btn= document.createElement("button");
    btn.textContent="Modificar Horario - Turno " + letra[nro + 1];
    btn.id= "btn" + nro;
    btn.className= "celda";
    btn.type= "button";
    btn.onclick = function () {
        cargarHorario(this.id.substring(3));
    };
    curso.appendChild(btn);
    campos.appendChild(curso);
}

function agregarTurno(){
    let campos= document.getElementById('listaTurnos');
    let curso= document.createElement('form');
    let nro= Choras.length;
    curso.innerHTML= campo;
    curso.className= "turno";
    let btn= document.createElement("button");
    btn.textContent="Modificar Horario - Turno " + letra[nro + 1];
    btn.id= "btn" + nro;
    btn.className= "celda";
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
    horas.push(parseInt(hora));
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

function actualizarCurso(){
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
    let cursos = JSON.parse(localStorage.getItem('cursos'));    
    cursos[_indiceCurso]= c;
    localStorage.setItem('cursos', JSON.stringify(cursos));
    navegar("../index.html");
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
    let cursos = JSON.parse(localStorage.getItem('cursos'));
    if(cursos == null){
        cursos=[];
    }
    cursos.push(c);
    localStorage.setItem('cursos', JSON.stringify(cursos));
    navegar("../index.html");
    //cursos.push(new Curso("Sistemas Operativos", ["306","306","306"], [[27,32,14,19],[51,56,44,49],[37,42,24,29]],["Karim","Aceituno","Karim"], true));
}