// --- CONFIGURATION & STATE ---
const DB_VERSION = 'RC_DB_PREMIUM_V1';
const DEFAULT_DATA = {
    patients: [
        { id: 101, name: 'Jean Martin', exam: 'IRM Cérébrale', ante: 'Diabète', time: '09:00', status: 'Terminé', paid: true, amount: 1200 },
        { id: 102, name: 'Alice Bernard', exam: 'Scanner Abdo', ante: 'Hypertension', time: '10:30', status: 'En cours', paid: false, amount: 800 },
        { id: 103, name: 'Robert Petit', exam: 'Écho Pelvienne', ante: 'Aucun', time: '11:15', status: 'En attente', paid: false, amount: 500 }
    ],
    ca: 1200,
    inventory: [
        { id: 1, name: 'Films Radio 24x30', qty: 150, unit: 'unités', status: 'OK' },
        { id: 2, name: 'Produit Contraste', qty: 12, unit: 'flacons', status: 'Bas' },
        { id: 3, name: 'Gants Stériles', qty: 5, unit: 'boîtes', status: 'Critique' }
    ],
    staff: [
        { id: 1, name: 'Dr. Jean Dupont', role: 'Administrateur', avatar: 'JD' },
        { id: 2, name: 'Dr. Sarah Alami', role: 'Radiologue', avatar: 'SA' },
        { id: 3, name: 'Sofia Bennani', role: 'Secrétaire', avatar: 'SB' }
    ]
};

window.state = JSON.parse(localStorage.getItem(DB_VERSION)) || DEFAULT_DATA;
const saveState = () => localStorage.setItem(DB_VERSION, JSON.stringify(window.state));

// --- AUTHENTICATION ---

function checkAuth() {
    const isAuth = localStorage.getItem('rc_auth') === 'true';
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!isAuth && !isLoginPage) {
        window.location.href = 'login.html';
    } else if (isAuth && isLoginPage) {
        window.location.href = 'index.html';
    }

    if (isAuth) {
        const username = localStorage.getItem('rc_user') || 'Admin';
        const userDisplay = document.getElementById('user-display-name');
        if (userDisplay) userDisplay.innerText = username;
    }
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('rc_auth');
        localStorage.removeItem('rc_user');
        window.location.href = 'login.html';
    }
}

// --- NAVIGATION & RENDERING ---

function showSection(id) {
    const titleEl = document.getElementById('section-title');
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick')?.includes(`'${id}'`)) {
            item.classList.add('active');
        }
    });

    const titles = {
        overview: 'Tableau de Bord',
        patients: 'Gestion des Patients',
        planning: 'Planning & RDV',
        billing: 'Facturation & Revenus',
        inventory: 'Gestion du Stock'
    };
    if (titleEl) titleEl.innerText = titles[id] || 'RadioCenter';

    renderSection(id);
}

function renderSection(id) {
    const area = document.getElementById('content-area');
    if (!area) return;

    if (id === 'overview') {
        area.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-value">${window.state.patients.length}</div>
                    <div class="stat-label">Patients Aujourd'hui</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📅</div>
                    <div class="stat-value">${window.state.patients.filter(p => p.status !== 'Terminé').length}</div>
                    <div class="stat-label">Rendez-vous à venir</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">${window.state.ca} DH</div>
                    <div class="stat-label">Revenus du jour</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⚠️</div>
                    <div class="stat-value">${window.state.inventory.filter(i => i.status !== 'OK').length}</div>
                    <div class="stat-label">Alertes Stock</div>
                </div>
            </div>

            <div class="table-container">
                <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-size: 1rem;">Activités Récentes</h3>
                    <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; border: 1px solid var(--border);">Voir tout</button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Heure</th>
                            <th>Patient</th>
                            <th>Examen</th>
                            <th>Statut</th>
                            <th>Paiement</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${window.state.patients.map(p => `
                            <tr>
                                <td style="font-size: 0.875rem; color: var(--text-muted);">${p.time}</td>
                                <td style="font-weight: 500;">${p.name}</td>
                                <td style="font-size: 0.875rem;">${p.exam}</td>
                                <td><span class="badge ${getStatusBadge(p.status)}">${p.status}</span></td>
                                <td style="text-align: center;">${p.paid ? '✅' : '⏳'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        area.innerHTML = `<div style="padding: 4rem; text-align: center; color: var(--text-muted);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚙️</div>
            <p>La section <strong>${id}</strong> est en cours de développement.</p>
        </div>`;
    }
}

function getStatusBadge(status) {
    if (status === 'Terminé') return 'badge-success';
    if (status === 'En cours') return 'badge-warning';
    return 'badge-danger';
}

// --- UI HELPERS ---

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    if (icon) icon.innerText = next === 'dark' ? '☀️' : '🌙';
    if (text) text.innerText = next === 'dark' ? 'Mode Clair' : 'Mode Sombre';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'error' ? '❌' : '🔔'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function switchRole(role) {
    showToast(`Passage au mode ${role.toUpperCase()}`, 'info');
}

function openModal(type) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    if (!overlay || !container) return;

    if (type === 'new-patient') {
        container.innerHTML = `
            <h2 style="margin-bottom: 1.5rem;">Nouveau Patient</h2>
            <div class="form-group">
                <label class="form-label">Nom du Patient</label>
                <input type="text" class="form-input" id="p-name" placeholder="Nom Complet">
            </div>
            <div class="form-group">
                <label class="form-label">Type d'Examen</label>
                <select class="form-input" id="p-exam">
                    <option>IRM Cérébrale</option>
                    <option>Scanner Abdominal</option>
                    <option>Échographie</option>
                </select>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button class="btn" style="flex: 1; border: 1px solid var(--border);" onclick="closeModal()">Annuler</button>
                <button class="btn btn-primary" style="flex: 1;" onclick="addPatient()">Enregistrer</button>
            </div>
        `;
    }
    overlay.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

function addPatient() {
    const name = document.getElementById('p-name').value;
    const exam = document.getElementById('p-exam').value;
    if (!name) return showToast('Nom requis', 'error');

    window.state.patients.unshift({
        id: Date.now(),
        name,
        exam,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'En attente',
        paid: false
    });
    saveState();
    closeModal();
    renderSection('overview');
    showToast('Patient ajouté', 'success');
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (localStorage.getItem('rc_auth') === 'true') {
        showSection('overview');
    }
});

// Expose globals for HTML
window.logout = logout;
window.showSection = showSection;
window.toggleTheme = toggleTheme;
window.switchRole = switchRole;
window.openModal = openModal;
window.closeModal = closeModal;
window.addPatient = addPatient;
window.showToast = showToast;
