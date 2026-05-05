import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  UserCircle,
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import './styles.css';

// --- AUTH LOGIC ---
const checkAuth = () => localStorage.getItem('rc_auth') === 'true';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth());
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rc_user') || '{"name": "Utilisateur", "role": "Radiologue"}'));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('rc_auth', 'true');
    localStorage.setItem('rc_user', JSON.stringify({ name: 'Dr. Khalil', role: 'Administrateur' }));
    setIsLoggedIn(true);
    setUser({ name: 'Dr. Khalil', role: 'Administrateur' });
  };

  const handleLogout = () => {
    localStorage.removeItem('rc_auth');
    localStorage.removeItem('rc_user');
    setIsLoggedIn(false);
    window.location.reload(); // Force refresh to clear state
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="logo-box">RC</div>
            <span>RadioCenter</span>
          </div>
          <h1 className="auth-title">Bon retour parmi nous</h1>
          <p className="auth-subtitle">Accédez à votre espace de gestion radiologique</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Identifiant</label>
              <input type="text" className="form-input" placeholder="admin" defaultValue="admin" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input type="password" className="form-input" placeholder="••••••••" defaultValue="admin" required />
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="auth-brand" style={{ justifyContent: 'flex-start', padding: '0 0.5rem' }}>
          <div className="logo-box" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>RC</div>
          <span style={{ fontSize: '1.25rem' }}>RadioCenter</span>
        </div>

        <nav className="nav-menu">
          <div className="nav-item active">
            <div className="nav-link"><LayoutDashboard size={20} /> Tableau de Bord</div>
          </div>
          <div className="nav-item">
            <div className="nav-link"><Users size={20} /> Patients</div>
          </div>
          <div className="nav-item">
            <div className="nav-link"><Calendar size={20} /> Rendez-vous</div>
          </div>
          <div className="nav-item">
            <div className="nav-link"><ClipboardList size={20} /> Examens</div>
          </div>
          <div className="nav-item">
            <div className="nav-link"><Settings size={20} /> Paramètres</div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-link" style={{ width: '100%', border: 'none', background: 'transparent', color: '#ef4444' }}>
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Tableau de Bord</h1>
            <span style={{ color: 'var(--text-muted)' }}>{user.name} ({user.role})</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="stat-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bell size={18} color="var(--text-muted)" />
              <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</div>
              </div>
              <UserCircle size={32} color="var(--primary)" />
            </div>
            <button onClick={handleLogout} className="btn-primary" style={{ background: '#ef4444', padding: '0.6rem 1.2rem' }}>
              <LogOut size={18} /> Quitter
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><TrendingUp size={20} /></div>
            <div className="stat-value">1,250 DT</div>
            <div className="stat-label">Chiffre d'affaires (Aujourd'hui)</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)'}}><Users size={20} /></div>
            <div className="stat-value">24</div>
            <div className="stat-label">Nouveaux Patients</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)'}}><Activity size={20} /></div>
            <div className="stat-value">8</div>
            <div className="stat-label">Examens en cours</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{color: 'var(--info)', background: 'rgba(59, 130, 246, 0.1)'}}><Clock size={20} /></div>
            <div className="stat-value">12</div>
            <div className="stat-label">Rendez-vous à venir</div>
          </div>
        </div>

        {/* Table Placeholder */}
        <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Search size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <h3>Prêt à gérer vos patients</h3>
          <p>Utilisez le menu à gauche pour commencer l'enregistrement.</p>
        </div>
      </main>
    </div>
  );
}
