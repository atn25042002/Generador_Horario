//Procesos de la pagina de Editar y crear nuevo Turno

var campo = `
<select class="celda" name="letra">
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
    <option value="D">D</option>
    <option value="E">E</option>
    <option value="F">F</option>
    <option value="G">G</option>
    <option value="H">H</option>
</select>

<label class="celda" for="docente">Docente:</label>
<input class="celda" type="text" name="docente" placeholder="Nombre del docente" required>

<label class="celda" for="aula">Aula:</label>
<input class="celda" type="text" name="aula" placeholder="Nombre del aula" required>

<label class="celda" for="preferencia">Preferencia:</label>
<input class="celda" type="checkbox" name="preferencia" checked>
`;

var CursoTurnos= []; //Contiene los turnos del curso en ese instante
var horas=[]; //Las horas seleccionadas en la tabla de colores
var turnoactual= 0;
var _indiceCurso;

//<div class="curso">

document.addEventListener("DOMContentLoaded", function() {    
    generarBloquesFunc();
    let url = new URL(window.location.href);
    let curso = url.searchParams.get("curso");
    let cursos= JSON.parse(localStorage.getItem('cursos'));
    if( curso != undefined && curso < cursos.length && cursos >= 0){
        _indiceCurso= curso;
        editarCurso(curso);
        //document.getElementById("btnguardar").setAttribute('onclick',"actualizarCurso()")
        document.getElementById("btnguardar").onclick = function () {
            actualizarCurso();
            navegar("../index.html");
        };
    }else{
        _indiceCurso= -1;
        agregarTurno();
    }
    cargarHorario(0);
});

window.addEventListener('beforeunload', function () {
    // Tu código aquí para guardar algo en el LocalStorage justo antes de cerrar la página.
    //localStorage.setItem('cursos', JSON.stringify(cursos));
});

function editarCurso(indice){
    //Carga los datos del curso de indice en el formulario.
    let formcurso= document.getElementById('datosCurso');
    let cursos= JSON.parse(localStorage.getItem('cursos'));
    let curso= cursos[indice];
    //Carga el formulario principal
    document.getElementById("tituloCurso").textContent= "EDITANDO " + curso.nombre.toUpperCase();
    formcurso.nombre.value= curso.nombre;
    formcurso.obligatorio.checked= curso.obligatorio;
    CursoTurnos= [...curso.turnos];   
    horas= CursoTurnos[turnoactual].horas;
    let nturnos= CursoTurnos.length;
    
    for(let i= 0; i< nturnos; i++){
        //Carga los turnos del curso en los campos de los fomularios
        agregarTurnoDatos(curso.turnos[i], i);
    }
}

function cargarHorario(turno){
    //Carga el horario al turno seleccionado en la tabla de colores.
    //let anterior = Choras[turnoactual];
    CursoTurnos[turnoactual].horas= [...horas]; //Guarda las horas actuales
    let copiahoras= [...horas];
    //Quita las horas del anterior turno
    copiahoras.forEach(function(hora){
        quitarhora(hora); //Las quita
    });
    document.getElementsByClassName('turno')[turnoactual].style= "";
    turnoactual= turno; //Ahora es un nuevo turno
    document.getElementsByClassName('turno')[turno].style.backgroundColor = "yellow";
    //Carga Las nuevas horas
    let nuevos = CursoTurnos[turno].horas;
    nuevos.forEach(function(hora){
        agregarhora(hora);
    });
}

function agregarTurnoDatos(turno, indice){
    //Crea un campo de turno con los datos indicados.
    let campos= document.getElementById('listaTurnos');
    let filaTurno= document.createElement('form');
    let nro= indice;
    filaTurno.innerHTML= campo;
    filaTurno.className= "turno";
    filaTurno.id= "turno-" + indice;
    filaTurno.letra.value= turno.letra;
    filaTurno.docente.value= turno.docente;
    filaTurno.aula.value= turno.aula;
    filaTurno.preferencia.checked= turno.preferencia;

    let btnModificar= document.createElement("button");
    btnModificar.textContent="Modificar Horario";
    btnModificar.id= "btn" + nro;
    btnModificar.className= "celda";
    btnModificar.type= "button";
    btnModificar.onclick = function () {
        cargarHorario(this.id.substring(3));
    };

    let btnEliminar= document.createElement('button');
    btnEliminar.textContent= "X";
    btnEliminar.setAttribute('id', "b-" + nro);
    btnEliminar.className= "celda";
    btnEliminar.type= "button";
    btnEliminar.onclick = function () {
        eliminarTurno(this.id.substring(2));
    };

    filaTurno.appendChild(btnModificar);
    filaTurno.appendChild(btnEliminar)
    campos.appendChild(filaTurno);
}

function acomodarAcciones(anterior, posterior){
    //Acomoda las acciones de los botones en base a dos indices anterior y posterior
    let btnModificar= document.getElementById("btn" + anterior);
    btnModificar.id= "btn" + posterior;
    btnModificar.onclick = function () {
        cargarHorario(this.id.substring(3));
    };

    let btnEliminar=  document.getElementById("b-" + anterior);
    btnEliminar.setAttribute('id', "b-" + posterior);
    btnEliminar.onclick = function () {
        eliminarTurno(this.id.substring(2));
    };
}

function agregarTurno(){
    //Agrega un nuevo campo para un turno nuevo
    let nro= CursoTurnos.length;    
    let campos= document.getElementById('listaTurnos');
    let filaTurno= document.createElement('form');
    filaTurno.innerHTML= campo;
    filaTurno.className= "turno";
    filaTurno.id= "turno-" + nro;
    if(nro < 8){
        filaTurno.letra.value= letra[nro + 1];
    }    
    let btnModificar= document.createElement("button");
    btnModificar.textContent="Modificar Horario";
    btnModificar.id= "btn" + nro;
    btnModificar.className= "celda";    
    btnModificar.type= "button";
    btnModificar.onclick = function () {
        cargarHorario(this.id.substring(3));
    };
    let btnEliminar= document.createElement('button');
    btnEliminar.textContent= "X";
    btnEliminar.setAttribute('id', "b-" + nro);
    btnEliminar.className= "celda";
    btnEliminar.type= "button";
    btnEliminar.onclick = function () {
        eliminarTurno(this.id.substring(2));
    };

    filaTurno.appendChild(btnModificar);
    filaTurno.appendChild(btnEliminar)
    CursoTurnos.push(new Turno("","","",[]));    
    campos.appendChild(filaTurno);
}

function eliminarTurno(indice){
    var confirmacion = confirm("¿Eliminar turno?");
    
    if (confirmacion) {
        let campos= document.getElementById('listaTurnos');
        let nturnos= CursoTurnos.length;
        if(nturnos== 1){
            agregarTurno();
        }
        if(indice == turnoactual){
            if(turnoactual == 0){
                cargarHorario(1);
                turnoactual= 0;
            }else{
                cargarHorario(turnoactual-1);
            }            
        }        
        campos.innerHTML= '';

        CursoTurnos.splice(indice,1);
        for(let i= 0; i< nturnos-1; i++){
            //Carga los turnos del curso en los campos de los fomularios
            agregarTurnoDatos(CursoTurnos[i], i);
        }

        if(indice < turnoactual){
            turnoactual--;
            cargarHorario(turnoactual);
        }else if(indice == turnoactual){
            cargarHorario(0);
        }else{
            cargarHorario(turnoactual);
        }
    }
}

function agregarhora(hora){
    //Selecciona la hora de la tabla de colores
    let zona= document.getElementById('hora' + hora);
    zona.style.backgroundColor = "blue";
    horas.push(parseInt(hora));
    zona.onclick = function () {
        quitarhora(hora);
    };
}

function quitarhora(hora){
    //Deselecciona la hora de la tabla de colores
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
    //Actualiza un curso ya ingresado
    let cursos = JSON.parse(localStorage.getItem('cursos'));
    cursoRecopilado= recopilarCurso();
    if(cursoRecopilado == null){
        return;
    }
    

    
    cursos[_indiceCurso]= cursoRecopilado;
    localStorage.setItem('cursos', JSON.stringify(cursos));
    //navegar("../index.html");
}

function guardarCurso(){
    //Guardar un nuevo Curso
    cursoRecopilado= recopilarCurso();
    if(cursoRecopilado == null){
        return;
    }
    
    let cursos = JSON.parse(localStorage.getItem('cursos'));
    if(cursos == null){
        cursos=[];
    }
    cursos.push(cursoRecopilado);
    localStorage.setItem('cursos', JSON.stringify(cursos));
    navegar("../index.html");
}

function recopilarCurso(){
    //Recopila la informacion de la interfaz y devuelve el curso
    cargarHorario(turnoactual);
    let formcurso= document.getElementById('datosCurso');    
    if(formcurso.nombre.value == ""){
        window.alert("Ingrese nombre del curso");
        return;
    }
    let elementosTurno= Array.from(document.getElementsByClassName('turno'));
    let nuevosTurnos= [];
    for(let i= 0; i< elementosTurno.length; i++){
        let turno = elementosTurno[i];
        if(turno.docente.value == "" || turno.aula.value == ""){
            document.getElementById("btn" + i).click();
            window.alert("Complete los datos de este turno"); 
            return;
        }
        if(CursoTurnos[i].horas.length == 0){
            document.getElementById("btn" + i).click();
            window.alert("Cargue los horarios de este turno");            
            return;
        }
        //Actualiza todos los turnos
        let nuevoturno= new Turno(turno.letra.value,turno.aula.value,turno.docente.value,CursoTurnos[i].horas,turno.preferencia.checked);
        nuevosTurnos.push(nuevoturno);
        /*if(turno.preferencia.checked){
            Crestricciones.push(i);
        }*/
    }
    c= new Curso(formcurso.nombre.value,nuevosTurnos,formcurso.obligatorio.checked);
    c.turnos.forEach(t => {
        let horasLimpias= t.horas.filter((valor, indice, array) => {
            return array.indexOf(valor) === indice;
          });
        t.horas= horasLimpias;
    });
    return c;
}