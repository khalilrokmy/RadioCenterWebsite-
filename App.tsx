import React, { useState, useEffect } from 'react';
import './styles.css';

// Mock Auth Check
const checkAuth = () => localStorage.getItem('rc_auth') === 'true';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth());
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rc_user') || '{}'));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('rc_auth', 'true');
    localStorage.setItem('rc_user', JSON.stringify({ name: 'Admin', role: 'Administrateur' }));
    setIsLoggedIn(true);
    setUser({ name: 'Admin', role: 'Administrateur' });
  };

  const handleLogout = () => {
    localStorage.removeItem('rc_auth');
    localStorage.removeItem('rc_user');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>RadioCenter</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Connexion à votre espace premium</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Identifiant</label>
              <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#000', border: '1px solid var(--border)', color: 'white' }} defaultValue="admin" />
            </div>
            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mot de passe</label>
              <input type="password" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#000', border: '1px solid var(--border)', color: 'white' }} defaultValue="admin" />
            </div>
            <button type="submit" className="btn-primary">Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>RC</h2>
        <nav style={{ flexGrow: 1 }}>
          <div style={{ padding: '0.75rem', color: 'var(--primary)', background: 'var(--primary-light)', borderRadius: '10px', fontWeight: 600 }}>Tableau de Bord</div>
          <div style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Patients</div>
          <div style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Examens</div>
        </nav>
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h1>Tableau de Bord</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: var(--text-muted) }}>{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1rem', background: '#ef4444' }}>Déconnexion</button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="stat-card">
            <h3>1,250 DT</h3>
            <p>Chiffre d'affaires</p>
          </div>
          <div className="stat-card">
            <h3>42</h3>
            <p>Patients aujourd'hui</p>
          </div>
          <div className="stat-card">
            <h3>12</h3>
            <p>Examens en attente</p>
          </div>
        </div>
      </main>
    </div>
  );
}
