let turnoActual = 1;
const turnosReservados = [];

function tomarTurno() {
    const dniInput = document.getElementById('dniInput');
    const dni = dniInput.value.trim();

    if (dni !== '') {
        turnosReservados.push({ turno: turnoActual, dni: dni });
        console.log(`Turno ${turnoActual} reservado para DNI ${dni}`);
        turnoActual++;
        actualizarTurnoDisplay();
        dniInput.value = '';
    } else {
        alert('Por favor, ingrese su DNI.');
    }
}

function llamarTurno() {
    if (turnoActual > 1) {
        const turnoLlamado = turnosReservados.shift();
        const mensaje = `Llamando turno ${turnoLlamado.turno} para DNI ${turnoLlamado.dni}`;
        alert(mensaje);
        actualizarTurnoDisplay();
    } else {
        alert('No hay turnos disponibles');
    }
}

function resetearContador() {
    turnoActual = 1;
    turnosReservados.length = 0;
    console.log('Contador de turnos reseteado');
    actualizarTurnoDisplay();
}

function buscarTurno() {
    const searchDNIInput = document.getElementById('searchDNI');
    const searchDNI = searchDNIInput.value.trim();

    if (searchDNI !== '') {
        const encontrado = turnosReservados.find(turno => turno.dni === searchDNI);
        
        if (encontrado) {
            alert(`Turno encontrado: ${encontrado.turno} para DNI ${encontrado.dni}`);
        } else {
            alert(`No se encontró ningún turno para el DNI ${searchDNI}`);
        }
    } else {
        alert('Por favor, ingrese un DNI para buscar el turno.');
    }

    searchDNIInput.value = ''; // Limpiar el campo de búsqueda después de la búsqueda
}

function actualizarTurnoDisplay() {
    document.getElementById('turn-number').innerText = turnoActual;
}

