function descargarDatos() {
    const datosJSON = JSON.stringify(cursos);
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.json'; // Nombre del archivo
    a.style.display = 'none';
  
    document.body.appendChild(a);
    a.click(); // Activa la descarga
    document.body.removeChild(a);
}

function cargarArchivoJSON() {
    const input = document.getElementById('jsonFileInput');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                cursos= JSON.parse(e.target.result);
                console.log('Contenido JSON cargado:', cursos);
                input.value = '';
                generarCursos();
                actualizar();
            } catch (error) {
                console.error('Error al cargar el archivo JSON:', error);
            }
        };

        reader.readAsText(file);
    } else {
        console.error('Selecciona un archivo JSON antes de cargarlo.');
    }
}