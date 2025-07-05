// Application State
let appState = {
    currentView: 'login',
    matricula: '',
    edificioSeleccionado: '',
    laboratorioSeleccionado: '',
    bitacoras: []
};

// Storage key for localStorage
const STORAGE_KEY = 'bitacora-uth-data';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeEventListeners();
    showScreen('login');
});

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            appState.bitacoras = parsed.bitacoras || [];
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        bitacoras: appState.bitacoras
    }));
}

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

    // Set current date and time
    const now = new Date();
    document.getElementById('fecha').value = now.toISOString().split('T')[0];
    document.getElementById('hora-inicio').value = now.toTimeString().slice(0, 5);
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

// Select laboratorio - MODIFICADA
function selectLaboratorio(laboratorio) {
    appState.laboratorioSeleccionado = laboratorio;
    
    // Mostrar la pantalla de registros en lugar del formulario
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
    
    // Set current date and time again
    const now = new Date();
    document.getElementById('fecha').value = now.toISOString().split('T')[0];
    document.getElementById('hora-inicio').value = now.toTimeString().slice(0, 5);
    document.getElementById('edificio-readonly').value = appState.edificioSeleccionado;
    
    showScreen('bitacora');
}

// Save bitacora
function saveBitacora() {
    const formData = {
        fecha: document.getElementById('fecha').value,
        horaInicio: document.getElementById('hora-inicio').value,
        horaSalida: document.getElementById('hora-salida').value,
        grupo: document.getElementById('grupo').value,
        cuatrimestre: document.getElementById('cuatrimestre').value,
        numAlumnos: document.getElementById('num-alumnos').value,
        curso: document.getElementById('curso').value,
        observaciones: document.getElementById('observaciones').value,
        matricula: document.getElementById('matricula-bitacora').value
    };
    
    const entry = {
        id: Date.now().toString(),
        ...formData,
        edificio: appState.edificioSeleccionado,
        laboratorio: appState.laboratorioSeleccionado,
        timestamp: Date.now()
    };
    
    appState.bitacoras.push(entry);
    saveData();
    showSuccessModal();
}

// Show success modal
function showSuccessModal() {
    document.getElementById('success-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
    // Volver a la vista de registros en lugar del formulario
    viewRecords();
}

// View records from modal
function viewRecordsFromModal() {
    document.getElementById('success-modal').classList.remove('active');
    viewRecords();
}

// View records
function viewRecords() {
    const filteredBitacoras = appState.bitacoras.filter(
        entry => entry.edificio === appState.edificioSeleccionado && 
                entry.laboratorio === appState.laboratorioSeleccionado
    );
    
    const sortedBitacoras = [...filteredBitacoras].sort((a, b) => b.timestamp - a.timestamp);
    
    // Update title
    document.getElementById('records-title').textContent = 
        `BITACORA LABORATORIO ${appState.edificioSeleccionado}${appState.laboratorioSeleccionado}`;
    
    // Create records table
    const recordsContent = document.getElementById('records-content');
    
    if (sortedBitacoras.length === 0) {
        recordsContent.innerHTML = `
            <div class="no-records">
                <div>No hay registros disponibles para este laboratorio</div>
                <p>Crea tu primera bitácora para verla aquí</p>
            </div>
        `;
    } else {
        const tableHTML = `
            <div class="records-table">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora Inicio</th>
                            <th>Hora Salida</th>
                            <th>Grupo</th>
                            <th>Cuatrimestre</th>
                            <th>Alumnos</th>
                            <th>Clase</th>
                            <th>Matrícula</th>
                            <th>Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedBitacoras.map((entry, index) => `
                            <tr>
                                <td>${entry.fecha}</td>
                                <td>${entry.horaInicio}</td>
                                <td>${entry.horaSalida}</td>
                                <td>${entry.grupo}</td>
                                <td>${entry.cuatrimestre}</td>
                                <td>${entry.numAlumnos}</td>
                                <td>${entry.curso}</td>
                                <td class="matricula-cell">${entry.matricula}</td>
                                <td class="observaciones-cell" title="${entry.observaciones}">${entry.observaciones}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        recordsContent.innerHTML = tableHTML;
    }
    
    showScreen('records');
}

// Navigation functions
function backToEdificio() {
    appState.edificioSeleccionado = '';
    appState.laboratorioSeleccionado = '';
    showScreen('edificio');
}

// MODIFICADA: Ahora va del bitacora form al records view (no al laboratorio screen)
function backToLaboratorio() {
    viewRecords();
}

// MODIFICADA: Ahora va del records view al bitacora form
function backToBitacora() {
    showBitacoraForm();
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