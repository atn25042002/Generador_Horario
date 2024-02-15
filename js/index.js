var lstcheck= [];
var lstcursosImport=[];

document.addEventListener("DOMContentLoaded", function() {
    //Se ejecuta al iniciar el index
    cursos= JSON.parse(localStorage.getItem('cursos'));
    if(cursos == null){
        cursos=[];
    }
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

function abrirMenuImportar(lista){
    let overlay = document.getElementById('miOverlay');
    let modal = document.getElementById('modalImport');
    overlay.style.display = 'block';
    modal.style.display = 'block';
    let lstimportcursos= document.getElementById("lstimportcursos");
    lstimportcursos.innerHTML= '';
    lstcheck= [];
    lstcursosImport= [...lista];
    for(let i = 0; i< lista.length; i++){
        let fila= document.createElement('div');
        fila.setAttribute('class' , 'fila');
        let lbl= document.createElement('label');
        lbl.textContent= lista[i].nombre;
        lbl.setAttribute('class', 'celda');
        lbl.setAttribute('for', 'curso' + i);
        let check= document.createElement('input');
        check.setAttribute('class', 'celda');
        check.type= 'checkbox';
        check.name= lista[i].nombre;
        check.id= 'curso' + i;
        check.checked= true;
        lstcheck.push(check);
        fila.appendChild(lbl);
        fila.appendChild(check);
        lstimportcursos.appendChild(fila);
    }
}

function cerrarMenuImportar(){
    let overlay = document.getElementById('miOverlay');
    let modal = document.getElementById('modalImport');
    overlay.style.display = 'none';
    modal.style.display = 'none';
}

function importarSeleccion(){
    let input = document.getElementById('jsonFileInput');
    for(let i= 0; i< lstcheck.length; i++){
        if(lstcheck[i].checked){
            cursos.push(lstcursosImport[i])
        }
    }                    
    cargarCursos();
    actualizar();
    window.alert("Cursos cargados")
    cerrarMenuImportar();
    input.value = '';    
}