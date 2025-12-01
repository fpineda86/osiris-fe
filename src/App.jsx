import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import EmpresaPage from './adapters/primary/EmpresaPage.jsx';
import SucursalPage from './adapters/primary/SucursalPage.jsx';
import PuntoEmisionPage from './adapters/primary/PuntoEmisionPage.jsx';
import RolPage from './adapters/primary/RolPage.jsx';
import TipoClientePage from './adapters/primary/TipoClientePage.jsx';
import ClientePage from './adapters/primary/ClientePage.jsx';
import UsuarioPage from './adapters/primary/UsuarioPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Nav() {
  const { pathname } = useLocation();
  return (
    <header className="ol-nav">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-text">
          <span className="brand-kicker">Open Latina</span>
          <span className="brand-name">Osiris</span>
        </div>
      </div>
      <nav className="nav-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Inicio</Link>
        <div className="nav-group">
          <button type="button" className="nav-trigger">
            Administracion
          </button>
          <div className="nav-menu">
            <div className="nav-section">
              <div className="nav-section-title">Empresa</div>
              <Link to="/empresas" className={pathname.startsWith('/empresas') ? 'active' : ''}>Empresa</Link>
              <Link to="/sucursales" className={pathname.startsWith('/sucursales') ? 'active' : ''}>Sucursales</Link>
              <Link to="/puntos-emision" className={pathname.startsWith('/puntos-emision') ? 'active' : ''}>Puntos de emision</Link>
            </div>
            <div className="nav-section">
              <div className="nav-section-title">Seguridad</div>
              <Link to="/roles" className={pathname.startsWith('/roles') ? 'active' : ''}>Roles</Link>
              <Link to="/usuarios" className={pathname.startsWith('/usuarios') ? 'active' : ''}>Usuarios</Link>
            </div>
            <div className="nav-section">
              <div className="nav-section-title">Clientes</div>
              <Link to="/tipos-cliente" className={pathname.startsWith('/tipos-cliente') ? 'active' : ''}>Tipos de cliente</Link>
              <Link to="/clientes" className={pathname.startsWith('/clientes') ? 'active' : ''}>Cliente</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function Home() {
  return (
    <div className="hero-shell">
      <div className="hero-grid">
        <div className="hero-copy glass-card">
          <p className="eyebrow">Plataforma de datos - Open Latina</p>
          <h1>Osiris</h1>
          <p className="lede">
            Gestion elegante y minimalista de empresas. Estandariza tu inventario de datos
            y manten a tu equipo alineado en un solo lugar.
          </p>
          <div className="hero-actions">
            <Link to="/empresas" className="btn-primary">Ver empresas</Link>
            <button className="btn-ghost" type="button" disabled>Proximamente</button>
          </div>
        </div>
        <div className="hero-panel glass-card">
          <div className="panel-head">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="panel-title">Estado</span>
          </div>
          <div className="metrics">
            <div>
              <p className="metric-label">Empresas registradas</p>
              <p className="metric-value">0</p>
            </div>
            <div>
              <p className="metric-label">Sincronizaciones</p>
              <p className="metric-value muted">No iniciadas</p>
            </div>
          </div>
          <div className="empty-card">
            <p className="empty-title">Aun no hay empresas</p>
            <p className="empty-text">Crea la primera para comenzar el catalogo.</p>
            <Link to="/empresas" className="btn-secondary">Ir a empresas</Link>
          </div>
        </div>
      </div>
      <div className="orbital" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<EmpresaPage />} />
          <Route path="/sucursales" element={<SucursalPage />} />
          <Route path="/puntos-emision" element={<PuntoEmisionPage />} />
          <Route path="/roles" element={<RolPage />} />
          <Route path="/usuarios" element={<UsuarioPage />} />
          <Route path="/tipos-cliente" element={<TipoClientePage />} />
          <Route path="/clientes" element={<ClientePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
