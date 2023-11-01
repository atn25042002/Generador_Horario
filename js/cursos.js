class Curso{
    constructor(nombre, aula, horas, docente, prioridad){
        this.nombre= nombre; //Nombre del curso - string
        this.aula= aula; //Aulas de los turnos - string[]         A     B     C
        this.horas= horas; //Horas de los turnos - int[][] ej: [[1,6],[2,5],[3,8]]
        this.docente= docente; // Docente de cada turno - String[]
        this.prioridad= prioridad // Si el curso es prioridad - bool[]
    }
}

var cursos= []; // Contiene los cursos registrados 
var posibles= []; // Guarda los posibles horarios [[1,2,3] ,[1,1,1]]
var restricciones= []; //Restricciones de turno  { 1 : [1,2] }
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
        for(let i= 0; i< curso.horas.length; i++){
            let opcion= document.createElement('option');
            opcion.text= letra[i+1];
            opcion.value= i;
            turnos.appendChild(opcion);
        }
        let lblprof= document.createElement('label');
        lblprof.textContent= curso.docente[0];
        lblprof.setAttribute('id', "p-" + i);
        //Se le asigna los formatos celda y fila para poder mostrarlos con tabulacion en css
        label.setAttribute('class', 'celda');
        turnos.setAttribute('class', 'celda');
        lblprof.setAttribute('class', 'celda');
        //Agrega el labdel del curso, la casilla select y el label del profesor a la fila
        fila.appendChild(label);
        fila.appendChild(turnos);
        fila.appendChild(lblprof);

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
        curso.horas[turno].forEach(function(hora){
            bloque= document.getElementById("hora" + hora);
            if(bloque.textContent != ""){
                //Si es que hay cruce
                bloque.style.color="red";
            }
            //Muestra el aula del turno en el horario y el profesor en la lista de turnos
            bloque.innerHTML= bloque.innerHTML + curso.nombre + "(" + curso.aula[turno] + ")" + "<br>";
            document.getElementById("p-"+i).textContent= curso.docente[turno];
        });
        i++;
    })
}

//
//
//
//
//
function evaluarHorario(turnos){
    //turnos = turnos propuestos a evaluar ej [0,1,2,3,0,0] -> Turno A , Turno B, ...
    //Evalua que tan bueno es el horario y si cumple con las restricciones
    let horasllenas=[]; //Horas que tienen asignadas un curso int[] Horas ocupadas
    let canthoras = 0; // int
    let ncursos= cursos.length; //Numero de cursos - int
    let boolprof= true; //Si es que los requerimientos de docente (turno) se cumplen
    //boolprof es true por defecto hasta q se demuestre lo contrario
    for(let i= 0; i< ncursos; i++){
        let turno= turnos[i]; //El turno del curso i  
        let horas= cursos[i].horas[turno]; //Las horas del curso i en el turno - int[]
        horasllenas.push(...horas); //Agrega las horas del curso a las horas llenas
        canthoras+= horas.length; //Suma la cantidad de horas necesarias
        if (restricciones[i] != undefined) {
            //Vefirica si es que el curso tiene alguna restriccion de turno
            if(!restricciones[i].includes(turno)){
                //Verifica si es que el turno propuesto esta incluido en las restricciones
                boolprof= false;
                break;
            }
        }
    }
    let horasunicas= new Set(horasllenas); //Crea un set para que se eliminen las horas repetidas
    let datos=[canthoras - horasunicas.size, boolprof];
    //Halla la diferencia entre las horas necesarias y las horas sin repetirse
    //Si hay menos es porque hay algun cruce
    //al final retorna un arreglo con dos datos
    //datos[0]: Horas de cruce
    //datos[1]: Bool que indica si es que se cumplen los requisitos del turno
    //return datos[0] && datos[1]
    return (datos);
}

function generarHorarios(){
    if(nrohorario >= 0){
        /*nrohorario++;
        if(nrohorario == max){
            nrohorario= 0;
        }*/
        nrohorario= Math.floor(Math.random() * (posibles.length));
        cargarTurnos(posibles[nrohorario]);
        window.alert("Horario generado - " + nrohorario);
        return;
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
        turnos.push(curso.docente.length - 1);
    })
    //crea un array con la misma longitud
    let arregloGenerado = new Array(turnos.length);
    //inicia la funcion recursiva
    setTimeout(function() {
        hacerCombinaciones(turnos, arregloGenerado, 0); // Oculta el modal cuando se completa el proceso largo
        console.log("Desbloqueando");
        overlay.style.display = 'none';
        modal.style.display = 'none';
        if(posibles.length==0){
            window.alert("No esposible generar un horario")
            return;
        }
        cargarTurnos(posibles[0]);
        nrohorario++;
        window.alert("Horario generado - " + nrohorario);
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

//
//
//
//
//
function hacerCombinaciones(arregloOriginal, arregloGenerado, indice) {
    //Función recursiva que examina cada posible horario
    /*if(max <= 0){
        //Se controla el maximo de horarios
        console.log("Maximo alcanzado");
        return;
    }*/

    if (indice === arregloOriginal.length) {
        //Si es que el indice que se varia es igual a la longitud es porque ya se modifico
        //todo el arreglo
        let cruces= evaluarHorario(arregloGenerado);
        //Evalua el horario
        if(cruces[0]== 0 && cruces[1]){
            //Si es que no tiene cruces y cumple con los turnos restringidos
            //Lo agrega al arreglo de posibles horarios
            posibles.push([...arregloGenerado]);
            //max--;
            return;
        }        
    }

    for (let i = 0; i <= arregloOriginal[indice]; i++) {
        //Por cada indice prueba las combinaciones posibles
        arregloGenerado[indice] = i;
        hacerCombinaciones(arregloOriginal, arregloGenerado, indice + 1);
    }
}