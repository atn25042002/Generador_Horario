document.addEventListener("DOMContentLoaded", function() {
    /*cursos.push(new Curso("Metodos Numéricos", ["306","306","306"], [[16,21,26],[43,48,53],[28,33,38]],["Olha","Olha","Olha"], true));
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
    cursos.push(new Curso("Lab - IDSE", ["205","306","306"], [[18,23],[42,47],[52,57]],["Giovanni","Giovanni","Giovanni"], true));*/
    cursos= JSON.parse(localStorage.getItem('cursos'));
    if(cursos == null){
        cursos=[];
    }
    //restricciones[1]= [0,2];
    //restricciones[4]= [1];
    //restricciones[3]= [0];
    generarBloques();
    cargarCursos();
    llenarHorario();    

    document.getElementById('nrohorario').addEventListener('change', function() {
        //Cada q cambia el valor del nro horario.
        if(this.value % 1 == 0 && this.value<= posibles.length){
            cargarTurnos(posibles[this.value-1]);
            this.style.color="black";
        }else{
            this.style.color="red";
        }
    });

});

window.addEventListener('beforeunload', function () {
    // Tu código aquí para guardar algo en el LocalStorage justo antes de cerrar la página.
    localStorage.setItem('cursos', JSON.stringify(cursos));
})

function eliminarCurso(indiceCurso){
    var confirmacion = confirm("¿Eliminar curso de " + cursos[indiceCurso].nombre + "?");
    if (confirmacion) {
        cursos.splice(indiceCurso,1);
        document.getElementById("turnos").innerHTML= '';
        cargarCursos();
        actualizar();
    }
}