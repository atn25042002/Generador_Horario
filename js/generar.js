class Curso{
    constructor(nombre, aula, horas, docente, prioridad){
        this.nombre= nombre;
        this.aula= aula;
        this.horas= horas;
        this.docente= docente;
        this.prioridad= prioridad
    }
}

var intervalosHorarios = [ // Guarda los valores de las horas
    "7:00 - 7:50",
    "7:50 - 8:40",
    "8:50 - 9:40",
    "9:40 - 10:30",
    "10:40 - 11:30",
    "11:30 - 12:20",
    "12:20  - 1:10",
    "1:10  - 2:00",
    "2:00  - 2:50",
    "2:50  - 3:40",
    "3:50  - 4:40",
    "4:40  - 5:30",
    "5:40  - 6:30",
    "6:30  - 7:20",
    "7:20  - 8:10",
    "8:10  - 9:00"
];

var letra = { //Convierte el Turno del curso a número
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
};

var cursos= []; // Contiene los cursos registrados
var posibles= []; // Guarda los posibles horarios
var restricciones= {}; //Restricciones de turno
var nrohorario= -1; //Nro de horario posible
var max= 20; //Maximo de horarios

function generarBloques(){
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
}

function generarCursos(){
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

function actualizar(){
    const tablaHTML = `
    <table id="horarioTable">
        <thead>
            <tr>
                <th id="horarioHora" >Hora</th>
                <th class="horarioDia">Lunes</th>
                <th class="horarioDia">Martes</th>
                <th class="horarioDia">Miércoles</th>
                <th class="horarioDia">Jueves</th>
                <th class="horarioDia">Viernes</th>
            </tr>
        </thead>
        <tbody>
            <!-- Las filas de la tabla serán generadas por JavaScript -->
        </tbody>
    </table>`;
    //Vuelve a inicializar la tabla
    document.getElementById("horarioTable").innerHTML= tablaHTML;
    //Vuelve a llenar
    generarBloques();
    llenarHorario();
}

function evaluarHorario(turnos){
    //Evalua que tan bueno es el horario y si cumple con las restricciones
    let horasllenas=[]; //Horas que tienen asisgnadas un curso
    let canthoras = 0;
    let ncursos= cursos.length; //Numero de cursos
    let boolprof= true; //Si es que los requerimientos de docente (turno) se cumplen
    for(let i= 0; i< ncursos; i++){
        let turno= turnos[i]; //El turno del curso i
        let horas= cursos[i].horas[turno]; //Las horas del curso i en el turno
        horasllenas.push(...horas); //Agrega las horas del curso a las horas llenas
        canthoras+= horas.length; //Suma la cantidad de horas necesarias
        if (restricciones[i] && Array.isArray(restricciones[i])) {
            //Vefirica si es que el curso tiene alguna restriccion de turno
            if(!restricciones[i].includes(turno)){
                //si es que la tiene manda false
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


document.addEventListener("DOMContentLoaded", function() {
    cursos.push(new Curso("Metodos Numéricos", ["306","306","306"], [[16,21,26],[43,48,53],[28,33,38]],["Olha","Olha","Olha"], true));
    cursos.push(new Curso("Sistemas Operativos", ["306","306","306"], [[27,32,14,19],[51,56,44,49],[37,42,24,29]],["Karim","Aceituno","Karim"], true));
    cursos.push(new Curso("Construcción de Software", ["306","306"], [[2,7],[36,41]],["Arroyo","Arroyo"], true));
    cursos.push(new Curso("Tecnología de objetos", ["306","306","302"], [[54,59,5,10],[71,76,74,79],[72,77,75,80]],["Bornas","Bornas","Sardón"], true));
    cursos.push(new Curso("Redes", ["205","306"], [[28,33,34,39],[57,62,68,73]],["Lucy","Lino"], true));
    cursos.push(new Curso("IDSE", ["205","306"], [[27,32,37],[41,46,51]],["Giovanni","Giovanni"], true));
    cursos.push(new Curso("Aspectos", ["306","306","302"], [[5,10],[42,47],[31,36]],["Maribel","Maribel","Maribel"], true));
    cursos.push(new Curso("Fundamentos", ["306","306","306"], [[18,23,20,25,30],[58,63,35,40,45],[3,8,13,4,9]],["Juarez","Juarez","Juarez"], true));
    cursos.push(new Curso("Lab- MN", ["306","306","306", "306"], [[32,37],[64,69],[1,6],[42,47]],["Polanco","Polanco","Polanco","Polanco"], true));
    cursos.push(new Curso("Lab- CS", ["306","306","306"], [[6,11,12,17],[16,21,33,38],[26,31,27,32]],["Arroyo","Arroyo","Arroyo"], true));
    cursos.push(new Curso("Lab- SO", ["306","306","306", "306"], [[12,17],[48,53],[11,16],[58,63]],["Aceituno","Aceituno","Aceituno", "Aceituno"], true));
    cursos.push(new Curso("Lab- Aspectos", ["306","306","306", "306"], [[4,9],[41,46],[51,56],[53,58]],["Maribel","Maribel","Ramiro", "Ramiro"], true));
    cursos.push(new Curso("Lab Redes", ["306","306"], [[24,29],[56,61]],["Lucy","Lino"], true));
    cursos.push(new Curso("Lab- TO", ["306","306","306","306", "306"], [[22,27],[56,61],[34,39],[44,49],[24,29]],["Bornas","Bornas","Karen","Karen", "Karen"], true));
    cursos.push(new Curso("Lab - IDSE", ["205","306","306"], [[18,23],[42,47],[52,57]],["Giovanni","Giovanni","Giovanni"], true));
    restricciones[1]= [0,2];
    restricciones[4]= [1];
    restricciones[3]= [0];
    generarBloques();
    generarCursos();
    llenarHorario();
});