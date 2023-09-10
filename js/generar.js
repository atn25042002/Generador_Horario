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

function generarBloques(){
    console.log("generado")
    let tableBody = document.querySelector("#horarioTable tbody");
    let sum= 0;
    intervalosHorarios.forEach(function(intervalo) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.textContent = intervalo;
        row.appendChild(cell);
        for (var i = 0; i < 5; i++) {
            cell = document.createElement("td");
            cell.textContent = "Clase " + (i + 1 + sum);
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
        sum+=5;
    });
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("iniciado")
    generarBloques();
});