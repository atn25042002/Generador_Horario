//Manejo de Cursos

class Curso{
    constructor(nombre, turnos, obligatorio){
        if(nombre != undefined){
            this.nombre= nombre//Nombre del curso - string
        }
        if(nombre != undefined){
            this.turnos= turnos
        }
        if(nombre != undefined){
            this.obligatorio= obligatorio// Si el curso es obligatorio - bool[]
        }
        //this.preferencias = [];
    }
}

class Turno{
    constructor(letra,aula,docente,horas, preferencia){
        this.letra= letra; //Letra representativa del turno
        this.aula= aula; //Aulas de los turnos - string
        this.docente= docente; // Docente de cada turno - String
        this.horas= horas; //Horas de los turnos - int[] ej [1,6,2,5]
        this.preferencia= preferencia; //Si el turno debe ser tomado en cuenta - bool
    }
}

var cursos= []; // Contiene los cursos registrados 
var posibles= []; // Guarda los posibles horarios [[1,2,3] ,[1,1,1]]
//var restricciones= []; //Restricciones de turno  { 1 : [1,2] }
var nrohorario= -1; //Nro de horario posible
var max= 20; //Maximo de horarios

/*function generarBloques(){
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
            //cell.textContent = "Clase " + n;
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
        sum+=5;
    });
}*/

function cargarCursos(){
    //Carga los cursos registrados con sus turnos
    let lstcursos= document.getElementById("turnos");
    lstcursos.innerHTML='';
    let i= 0;
    cursos.forEach(function(curso){
        let fila= document.createElement('div');
        fila.setAttribute('class' , 'fila')    
        let label= document.createElement('label');
        label.textContent= curso.nombre;
        let turnos= document.createElement('select');
        turnos.setAttribute('id', "s-" + i);
        turnos.addEventListener("change", function() {
            actualizar();
        });
        let nturnos = curso.turnos.length;
        for(let i= 0; i< nturnos; i++){
            let opcion= document.createElement('option');
            opcion.text= curso.turnos[i].letra;
            opcion.value= i;
            turnos.appendChild(opcion);
        }
        let lblprof= document.createElement('label');
        lblprof.textContent= curso.turnos[0].docente;
        lblprof.setAttribute('id', "p-" + i);

        let btneditar= document.createElement('button');
        btneditar.textContent= "Editar";
        btneditar.setAttribute('id', "b-" + i);
        btneditar.onclick = function () {
            navegar("./pages/ingreso.html?curso=" + this.id.substring(2));
        };

        let btneliminar= document.createElement('button');
        btneliminar.textContent= "X";
        btneliminar.setAttribute('id', "b-" + i);
        btneliminar.onclick = function () {
            eliminarCurso(this.id.substring(2));
        };

        //Se le asigna los formatos celda y fila para poder mostrarlos con tabulacion en css
        label.setAttribute('class', 'celda');
        turnos.setAttribute('class', 'celda');
        lblprof.setAttribute('class', 'celda');
        btneditar.setAttribute('class', 'celda');
        btneliminar.setAttribute('class', 'celda');
        //Agrega el labdel del curso, la casilla select y el label del profesor a la fila
        fila.appendChild(label);
        fila.appendChild(turnos);
        fila.appendChild(lblprof);
        fila.appendChild(btneditar);
        fila.appendChild(btneliminar);

        lstcursos.appendChild(fila); // Añade la fila al div
        //lstcursos.append(document.createElement("br"));
        i++;
    })
}

function llenarHorario(){
    //Llena el horario con los cursos y sus turnos seleccionados
    let bloque;
    let i= 0;
    cursos.forEach(function(curso){
        let turno= document.getElementById('s-' + i).value;
        curso.turnos[turno].horas.forEach(function(hora){
            bloque= document.getElementById("hora" + hora);
            if(bloque.textContent != ""){
                //Si es que hay cruce
                bloque.style.color="red";
            }
            //Muestra el aula del turno en el horario y el profesor en la lista de turnos
            bloque.innerHTML= bloque.innerHTML + curso.nombre + "(" + curso.turnos[turno].aula + ")" + "<br>";
            document.getElementById("p-"+i).textContent= curso.turnos[turno].docente;
        });
        i++;
    })
}

function evaluarHorario(propuestos){ //Usar
    //turnos = turnos propuestos a evaluar ej [0,1,2,3,0,0] -> Turno A , Turno B, ...
    //Evalua que tan bueno es el horario y si cumple con las restricciones

    let ncursos= cursos.length; //Numero de cursos - int
    let boolprof= true; //Si es que los requerimientos de docente (turno) se cumplen
    //boolprof es true por defecto hasta q se demuestre lo contrario
    for(let i= 0; i< ncursos; i++){
        let turno= propuestos[i]; //El turno del curso i
        let preferencias=cursos[i].preferencias;
        if (preferencias.length > 0) {
            //Vefirica si es que el curso tiene alguna restriccion de turno
            if(!preferencias.includes(turno)){
                //Verifica si es que el turno propuesto esta incluido en las restricciones
                boolprof= false;
                break;
            }
        }
    }
    return boolprof;
}

function generarHorarios(){
    if(cursos.length==0){
        window.alert("Ingrese los cursos, primero")
        return;
    }
    if(nrohorario >= 0){
        /*nrohorario++;
        if(nrohorario == max){
            nrohorario= 0;
        }*/
        var confirmacion = confirm("Ya hay horarios generados\n¿Deseas generar horarios?");
        if (!confirmacion) {
            return;
        }
    }else{
        var confirmacion = confirm("¿Deseas generar horarios?");
        if (!confirmacion) {
            return;
        }
    }
    //console.log(posibles);
    //console.log("generando horarios");
    let overlay = document.getElementById('miOverlay');
    let modal = document.getElementById('miModal');
    console.log("Bloqueando");
    overlay.style.display = 'block';
    modal.style.display = 'block';

    let turnos= []; //Crea un arreglo donde se almacenara el numero de turnos disponibles por curso
    cursos.forEach(function(curso){
        //añade como elemento i al arreglo de turno el numero de turnos -1
        //si esque hubiese tres turnos se agrega 2
        turnos.push(curso.turnos.length - 1);
    })
    //crea un array con la misma longitud
    let arregloGenerado = new Array(turnos.length);
    //inicia la funcion recursiva
    setTimeout(function() {
        turnosArray= [];
        horasSet= new Set();
        console.time('miFuncion');
        hacerPermutaciones(turnosArray,horasSet,0);
        console.timeEnd('miFuncion');

        overlay.style.display = 'none';
        modal.style.display = 'none';
        let lblnrohorario= document.getElementById("lblnrohorario");
        if(posibles.length==0){
            lblnrohorario.textContent= 'Nro. Horario (No Generados)';
            window.alert("No esposible generar un horario")
            return;
        }
        cargarTurnos(posibles[0]);
        nrohorario++;
        lblnrohorario.textContent= 'Nro. Horario (máx. ' + posibles.length + ')';
        window.alert("Horario generados:  " + posibles.length + "\nMostrando el primer horario");
    }, 1000);
    //carga el primer horario posible
}

function cargarTurnos(turnos){
    //Carga los turnos a los select y actualiza los cursos y el horario.
    let i= 0;
    turnos.forEach(function(turno){
        document.getElementById('s-' + i).value= turno;
        i++;
    })
    actualizar();
}

function hacerPermutaciones(turnos, setEntrada, indice){
    //Array, Set, int

    if (indice === cursos.length) {
        posibles.push([...turnos]);
        return;
    }

    let maxturnos= cursos[indice].turnos.length; //Cantidad de turnos
    for (let i = 0; i < maxturnos; i++) {
        setHoras= new Set(setEntrada); // Crea una copia del set de Entrada
        nuevosTurnos= [...turnos];
        let setHorasTurno= new Set(cursos[indice].turnos[i].horas);
        if(!cursos[indice].turnos[i].preferencia ||tieneCruce(setHorasTurno,setHoras)){ //Si es que tienen alguno en comun
            continue; //Pasa a la siguiente rama
        }
        //setHoras.union(new Set(cursos[indice].turnos[i].horas)); //Carga los elementos del Turno
        setHorasTurno.forEach(elemento => {
            setHoras.add(elemento);
        });
        nuevosTurnos.push(i); //Agrega el turno si no hay cruce
        hacerPermutaciones(nuevosTurnos, setHoras, indice + 1);
    }
}

function tieneCruce(set1, set2) {
    /*// Convierte los arrays a Sets para optimizar la búsqueda
    //De preferencia que el set1 sea el pequeño
    const set1 = new Set(array1);
    const set2 = new Set(array2);*/
  
    // Verifica si hay intersección entre los sets
    for (const elemento of set1) {
      if (set2.has(elemento)) {
        return true;
      }
    }  
    return false;  
}