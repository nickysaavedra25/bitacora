// Application State
let appState = {
    currentView: 'login',
    matricula: '',
    edificioSeleccionado: '',
    laboratorioSeleccionado: ''
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showScreen('login');
});

// Initialize event listeners
function initializeEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const matricula = document.getElementById('matricula').value.trim();
        if (matricula) {
            login(matricula);
        }
    });

    // Bitacora form
    document.getElementById('bitacora-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveBitacora();
    });
}

// Show specific screen
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenName + '-screen').classList.add('active');
    appState.currentView = screenName;
}

// Login function
function login(matricula) {
    appState.matricula = matricula;
    showScreen('edificio');
}

// Select edificio
function selectEdificio(edificio) {
    appState.edificioSeleccionado = edificio;
    showLaboratorioScreen(edificio);
}

// Show laboratorio selection screen
function showLaboratorioScreen(edificio) {
    const laboratorios = edificio === 'E' ? ['E2', 'E3', 'E4', 'E5'] : ['R1', 'R2'];
    
    // Update title
    document.getElementById('edificio-title').textContent = `Laboratorios del edificio ${edificio}`;
    
    // Create laboratorio buttons
    const buttonsContainer = document.getElementById('laboratorio-buttons');
    buttonsContainer.innerHTML = '';
    
    laboratorios.forEach(lab => {
        const button = document.createElement('button');
        button.className = 'selection-btn';
        button.textContent = lab;
        button.onclick = () => selectLaboratorio(lab);
        buttonsContainer.appendChild(button);
    });
    
    showScreen('laboratorio');
}

// Select laboratorio - Shows records first
function selectLaboratorio(laboratorio) {
    appState.laboratorioSeleccionado = laboratorio;
    viewRecords();
}

// Show bitacora form
function showBitacoraForm() {
    document.getElementById('laboratorio-info').textContent = 
        `Laboratorio: ${appState.edificioSeleccionado}${appState.laboratorioSeleccionado}`;
    document.getElementById('edificio-readonly').value = appState.edificioSeleccionado;
    document.getElementById('matricula-bitacora').value = appState.matricula;
    
    // Reset form
    document.getElementById('bitacora-form').reset();
    
    // Set current date and time
    const now = new Date();
    document.getElementById('fecha').value = now.toISOString().split('T')[0];
    document.getElementById('hora-inicio').value = now.toTimeString().slice(0, 5);
    document.getElementById('edificio-readonly').value = appState.edificioSeleccionado;
    document.getElementById('matricula-bitacora').value = appState.matricula;
    
    showScreen('bitacora');
}

// Save bitacora - Simulates saving without storing
function saveBitacora() {
    const formData = {
        fecha: document.getElementById('fecha').value,
        horaInicio: document.getElementById('hora-inicio').value,
        horaSalida: document.getElementById('hora-salida').value,
        grupo: document.getElementById('grupo').value,
        cuatrimestre: document.getElementById('cuatrimestre').value,
        numeroAlumnos: parseInt(document.getElementById('num-alumnos').value),
        curso: document.getElementById('curso').value,
        observaciones: document.getElementById('observaciones').value,
        matricula: document.getElementById('matricula-bitacora').value,
        edificio: appState.edificioSeleccionado,
        laboratorio: appState.laboratorioSeleccionado
    };
    
    // Log the data that would be sent to API
    console.log('Datos del formulario (listos para API):', formData);
    
    // Show success modal
    showSuccessModal();
}

// Show success modal
function showSuccessModal() {
    document.getElementById('success-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
    // Reset form for new entry
    showBitacoraForm();
}

// View records from modal
function viewRecordsFromModal() {
    document.getElementById('success-modal').classList.remove('active');
    viewRecords();
}

// View records - Shows empty state (ready for API integration)
function viewRecords() {
    // Update title
    document.getElementById('records-title').textContent = 
        `BITACORA LABORATORIO ${appState.edificioSeleccionado}${appState.laboratorioSeleccionado}`;
    
    // Show empty state (ready for API data)
    const recordsContent = document.getElementById('records-content');
    recordsContent.innerHTML = `
        <div class="no-records">
            <div>No hay registros disponibles para este laboratorio</div>
            <p>Crea tu primera bitácora para verla aquí</p>
        </div>
    `;
    
    showScreen('records');
}

// Navigation functions
function backToEdificio() {
    appState.edificioSeleccionado = '';
    appState.laboratorioSeleccionado = '';
    showScreen('edificio');
}

function logout() {
    appState.matricula = '';
    appState.edificioSeleccionado = '';
    appState.laboratorioSeleccionado = '';
    appState.currentView = 'login';
    
    // Reset login form
    document.getElementById('matricula').value = '';
    
    showScreen('login');
}