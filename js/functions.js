"use strict";

document.addEventListener('DOMContentLoaded', function () {
  let turnos = cargarTurnos();
  let timer;
  let turnosList = document.getElementById('turnosList');
  let turnosLlamadosList = document.getElementById('turnosLlamadosList');
  let usuarioLogueado = false; // Variable para verificar el inicio de sesión

  function cargarTurnos() {
    let turnosGuardados = localStorage.getItem('turnos');
    return turnosGuardados ? JSON.parse(turnosGuardados) : [];
  }

  function cargarTurnosLlamados() {
    let turnosLlamadosGuardados = localStorage.getItem('turnosLlamados');
    return turnosLlamadosGuardados ? JSON.parse(turnosLlamadosGuardados) : [];
  }

  function guardarTurnos() {
    localStorage.setItem('turnos', JSON.stringify(turnos));
  }

  function guardarTurnosLlamados(turnosLlamados) {
    localStorage.setItem('turnosLlamados', JSON.stringify(turnosLlamados));
  }

  function generarNumero(opcion) {
    let prefijo = '';
    switch (opcion) {
      case 'Consultorio':
        prefijo = 'C';
        break;
      case 'Guardia':
        prefijo = 'G';
        break;
      case 'Vacunatorio':
        prefijo = 'V';
        break;
      default:
        prefijo = 'O';
    }
    let numero = turnos.length + 1;
    return `${prefijo}${numero}`;
  }

  function solicitarTurno(dni, opcion) {
    // Verificar si el turno ya fue llamado previamente
    if (turnoYaLlamado(opcion)) {
      mostrarErrorTurnoLlamado();
      return;
    }

    let numero = generarNumero(opcion);
    turnos.push({ dni: dni, numero: numero });
    guardarTurnos();
    mostrarTurnoAsignado(numero);
    limpiarPantallaDespuesDe5Segundos();
  }

  function turnoYaLlamado(opcion) {
    // Obtener la lista de turnos llamados
    let turnosLlamados = cargarTurnosLlamados();
  }

  function mostrarTurnoAsignado(numero) {
    Swal.fire({
      title: 'Su número asignado es:',
      html: `<div style="font-size: 54px; font-weight: bold;">${numero}</div>`,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false
    });

    limpiarPantallaDespuesDe5Segundos();
  }

  function limpiarPantallaDespuesDe5Segundos() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      limpiarPantalla();
    }, 5000);
  }

  function limpiarPantalla() {
    document.getElementById('dniInput').value = '';
    document.getElementById('successDNI').classList.add('hidden');
    document.getElementById('formularioDNI').classList.remove('hidden');
    document.getElementById('opcionesTurno').classList.add('hidden');
    document.getElementById('interfazAdministrador').classList.add('hidden');
    reiniciarTimer();
  }

  function reiniciarTimer() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      limpiarPantalla();
    }, 30000);
  }

  function validarDNI(dni) {
    return /^\d{8}$/.test(dni);
  }

  function mostrarErrorDNI() {
    let dniInput = document.getElementById('dniInput');
    let errorDNI = document.getElementById('errorDNI');
    let successDNI = document.getElementById('successDNI');
    dniInput.classList.add('error');
    errorDNI.classList.remove('hidden');
    successDNI.classList.add('hidden');
  }

  function mostrarSuccessDNI() {
    let dniInput = document.getElementById('dniInput');
    let errorDNI = document.getElementById('errorDNI');
    let successDNI = document.getElementById('successDNI');
    dniInput.classList.remove('error');
    errorDNI.classList.add('hidden');
    successDNI.classList.remove('hidden');
  }

  const usuarioAdmin = 'admin';
  const claveAdmin = 'admin';

  function mostrarFormularioLogin() {
    Swal.fire({
      title: 'Inicio de Sesión',
      html: `
        <label for="usuarioInput" class="form-label">Usuario:</label>
        <input type="text" id="usuarioInput" class="form-control" placeholder="Usuario">
        <label for="claveInput" class="form-label mt-2">Contraseña:</label>
        <input type="password" id="claveInput" class="form-control" placeholder="Contraseña">
      `,
      showCancelButton: true,
      confirmButtonText: 'Iniciar Sesión',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const usuario = Swal.getPopup().querySelector('#usuarioInput').value;
        const clave = Swal.getPopup().querySelector('#claveInput').value;

        if (usuario === usuarioAdmin && clave === claveAdmin) {
          usuarioLogueado = true;
          mostrarInterfazAdministrador();
        } else {
          mostrarErrorLogin();
        }
      }
    });
  }

  function mostrarErrorLogin() {
    Swal.fire({
      title: 'Error de inicio de sesión',
      text: 'Usuario o contraseña incorrectos. Inténtelo nuevamente.',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    });
  }

  let dniInput = document.getElementById('dniInput');
  let btnAceptarDNI = document.getElementById('btnAceptarDNI');
  let opcionesTurno = document.getElementById('opcionesTurno');
  let enlacePanelAdmin = document.getElementById('enlacePanelAdmin');
  let btnSalirAdministrador = document.getElementById('btnSalirAdministrador');
  let btnReiniciarContador = document.getElementById('btnReiniciarContador');
  let btnLlamarTurno = document.getElementById('btnLlamarTurno');

  btnAceptarDNI.addEventListener('click', function () {
    let dniValue = dniInput.value;
    if (validarDNI(dniValue)) {
      mostrarSuccessDNI();
      document.getElementById('formularioDNI').classList.add('hidden');
      opcionesTurno.classList.remove('hidden');
      document.getElementById('interfazAdministrador').classList.add('hidden');
      actualizarListadoTurnos();
      reiniciarTimer();
    } else {
      mostrarErrorDNI();
      opcionesTurno.classList.add('hidden');
      document.getElementById('interfazAdministrador').classList.add('hidden');
    }
  });

  opcionesTurno.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      let dniValue = dniInput.value;
      let opcionTurno = event.target.getAttribute('data-tipo');

      if (validarDNI(dniValue)) {
        solicitarTurno(dniValue, opcionTurno);
      } else {
        mostrarErrorDNI();
      }
    }
  });

  enlacePanelAdmin.addEventListener('click', function (event) {
    event.preventDefault();
    mostrarFormularioLogin();
  });

  btnSalirAdministrador.addEventListener('click', function () {
    limpiarPantalla();
  });

  btnReiniciarContador.addEventListener('click', function () {
    mostrarConfirmacionReinicio();
  });

  btnLlamarTurno.addEventListener('click', function () {
    llamarTurno();
  });

  function mostrarConfirmacionReinicio() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se reiniciará el contador de turnos y se perderán los turnos asignados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        reiniciarContador();
        Swal.fire({
          title: 'Contador reiniciado',
          text: 'Se ha reiniciado el contador de turnos.',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  function llamarTurno() {
    let proximoTurno = turnos.shift();
    if (proximoTurno) {
      Swal.fire({
        title: 'Llamando al turno:',
        html: `<div style="font-size: 36px; font-weight: bold;">${proximoTurno.numero} - DNI: ${proximoTurno.dni}</div>`,
        icon: 'info',
        showConfirmButton: false,
        timer: 5000
      });

      // Guardar el turno llamado en el array de turnos llamados
      let turnosLlamados = cargarTurnosLlamados();
      turnosLlamados.push(proximoTurno);
      guardarTurnosLlamados(turnosLlamados);

      // Actualizar la lista de turnos y el localStorage
      guardarTurnos();
      actualizarListadoTurnos();
      mostrarListadoTurnosLlamados();
    } else {
      Swal.fire({
        title: 'No hay más turnos',
        icon: 'warning',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  function reiniciarContador() {
    turnos = [];
    guardarTurnos();
    actualizarListadoTurnos();
  }

  function mostrarInterfazAdministrador() {
    document.getElementById('formularioDNI').classList.add('hidden');
    opcionesTurno.classList.add('hidden');
    document.getElementById('interfazAdministrador').classList.remove('hidden');
    actualizarListadoTurnos();
    mostrarListadoTurnosLlamados();
    clearTimeout(timer);
  }

  function actualizarListadoTurnos() {
    turnosList.innerHTML = '';
    let turnosGuardados = cargarTurnos();
    turnosGuardados.forEach(turno => {
      let listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = `Turno: ${turno.numero} - DNI: ${turno.dni}`;
      turnosList.appendChild(listItem);
    });
  }

  function mostrarListadoTurnosLlamados() {
    turnosLlamadosList.innerHTML = '';
    let turnosLlamadosGuardados = cargarTurnosLlamados();
    turnosLlamadosGuardados.forEach(turno => {
      let listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = `Turno: ${turno.numero} - DNI: ${turno.dni}`;
      turnosLlamadosList.appendChild(listItem);
    });
  }
});
