class Curso{
    constructor(nombre, aula, horas, docente, prioridad){
        this.nombre= nombre;
        this.aula= aula;
        this.horas= horas;
        this.docente= docente;
        this.prioridad= prioridad
    }
}

var intervalosHorarios = [
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

var letra = {
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

var cursos= [];

function generarBloques(){
    //Genera el horario con dias y horas vacios
    console.log("generado")
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
        lblprof.setAttribute('id', "p-" + i)
        label.setAttribute('class', 'celda');
        turnos.setAttribute('class', 'celda');
        lblprof.setAttribute('class', 'celda');
        fila.appendChild(label);
        fila.appendChild(turnos);
        fila.appendChild(lblprof);

        lstcursos.appendChild(fila);
        //lstcursos.append(document.createElement("br"));
        i++;
    })
}

function llenarHorario(){
    //Llena el horario con los cursos y sus turnos seleccionados
    let bloque;
    console.log(cursos);
    let i= 0;
    cursos.forEach(function(curso){
        let turno= document.getElementById('s-' + i).value;
        curso.horas[turno].forEach(function(hora){
            bloque= document.getElementById("hora" + hora);
            if(bloque.textContent != ""){
                bloque.style.color="red";
            }
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
    document.getElementById("horarioTable").innerHTML= tablaHTML;
    generarBloques();
    llenarHorario();
}

document.addEventListener("DOMContentLoaded", function() {
    cursos.push(new Curso("Metodos Numéricos", ["306","306","306"], [[16,21,26],[43,48,53],[28,33,38]],["Olha","Olha","Olha"], true));
    cursos.push(new Curso("Sistemas Operativos", ["306","306","306"], [[27,32,14,19],[51,56,44,49],[37,42,24,29]],["Karim","Aceituno","Karim"], true));
    cursos.push(new Curso("Construcción de Software", ["306","306","306"], [[6,11],[36,41],[17,22],[47,52]],["Arroyo","Arroyo","Edith","Edith"], true));
    cursos.push(new Curso("Tecnología de objetos", ["306","306","302"], [[54,59,5,10],[71,76,74,79],[72,77,75,80]],["Bornas","Bornas","Sardón"], true));
    cursos.push(new Curso("Redes", ["205","306","306"], [[28,33,34,39],[57,62,68,73],[67,72,34,39]],["Lucy","Lino","Lino"], true));
    cursos.push(new Curso("Fundamentos", ["306","306","306"], [[18,23,20,25,30],[58,63,35,40,45],[3,8,13,4,9]],["Juarez","Juarez","Juarez"], true));
    generarBloques();
    generarCursos();
    llenarHorario();
});