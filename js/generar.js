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
    "7:00 AM - 7:50 AM",
    "7:50 AM - 8:40 AM",
    "8:50 AM - 9:40 AM",
    "9:40 AM - 10:30 AM",
    "10:40 AM - 11:30 AM",
    "11:30 AM - 12:20 PM",
    "12:20 PM - 1:10 PM",
    "1:10 PM - 2:00 PM",
    "2:00 PM - 2:50 PM",
    "2:50 PM - 3:40 PM",
    "3:50 PM - 4:40 PM",
    "4:40 PM - 5:30 PM",
    "5:40 PM - 6:30 PM",
    "6:30 PM - 7:20 PM",
    "7:20 PM - 8:10 PM",
    "8:10 PM - 9:00 PM"
];

var cursos= [];

function generarBloques(){
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

function llenarHorario(){
    let bloque;
    /*Object.keys(cursos).forEach(function(curso){
        cursos[curso].forEach(function(hora){
            bloque= document.getElementById("hora" + hora);
            if(bloque.textContent != ""){
                bloque.style.color="red";
            }
            bloque.innerHTML= bloque.innerHTML + curso + "<br>";
        });
    });*/
    console.log(cursos);
    cursos.forEach(function(curso){
        curso.horas.forEach(function(hora){
            bloque= document.getElementById("hora" + hora);
            if(bloque.textContent != ""){
                bloque.style.color="red";
            }
            bloque.innerHTML= bloque.innerHTML + curso.nombre + "(" + curso.aula + ")" + "<br>";
        });
    })
}

document.addEventListener("DOMContentLoaded", function() {
    cursos.push(new Curso("Metodos Numéricos", "306", [1,6],"Olha", true));
    cursos.push(new Curso("Sistemas Operativos", "306", [2,3,7],"Karim", true));
    cursos.push(new Curso("Construcción de Software", "306", [3,8],"Arroyo", true));
    generarBloques();
    llenarHorario();
});