//Funciones y variables generales

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

function navegar(dir){
    window.location.href = dir;
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
};