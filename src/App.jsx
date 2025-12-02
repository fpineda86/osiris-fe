import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import EmpresaPage from './adapters/primary/EmpresaPage.jsx';
import SucursalPage from './adapters/primary/SucursalPage.jsx';
import PuntoEmisionPage from './adapters/primary/PuntoEmisionPage.jsx';
import RolPage from './adapters/primary/RolPage.jsx';
import TipoClientePage from './adapters/primary/TipoClientePage.jsx';
import ClientePage from './adapters/primary/ClientePage.jsx';
import UsuarioPage from './adapters/primary/UsuarioPage.jsx';
import EmpleadoPage from './adapters/primary/EmpleadoPage.jsx';
import ProveedorPage from './adapters/primary/ProveedorPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function TopBar() {
  return (
    <header className="top-bar">
      <Link to="/" className="logo-link" aria-label="Ir a inicio">
        <img src="/osiris-logo.svg" alt="Osiris" className="logo-img" />
      </Link>
      <div className="user-menu">
        <button className="user-chip" type="button">
          <span className="user-avatar">U</span>
          <span className="user-name">Usuario</span>
          <span className="caret">v</span>
        </button>
        <div className="user-dropdown">
          <button type="button">Perfil</button>
          <button type="button">Configuracion</button>
          <button type="button">Cerrar sesion</button>
        </div>
      </div>
    </header>
  );
}

function SideMenu() {
  const { pathname } = useLocation();
  return (
    <aside className="side-menu">
      <div className="side-menu-section">
        <div className="side-menu-title" tabIndex={0}>Administración</div>
        <div className="side-menu-items">
          <Link to="/empresas" className={pathname.startsWith('/empresas') ? 'active' : ''}>Empresas</Link>
          <Link to="/sucursales" className={pathname.startsWith('/sucursales') ? 'active' : ''}>Sucursales</Link>
          <Link to="/puntos-emision" className={pathname.startsWith('/puntos-emision') ? 'active' : ''}>Puntos de emisión</Link>
        </div>
      </div>
      <div className="side-menu-section">
        <div className="side-menu-title" tabIndex={0}>Seguridad</div>
        <div className="side-menu-items">
          <Link to="/roles" className={pathname.startsWith('/roles') ? 'active' : ''}>Roles</Link>
          <Link to="/usuarios" className={pathname.startsWith('/usuarios') ? 'active' : ''}>Usuarios</Link>
        </div>
      </div>
      <div className="side-menu-section">
        <div className="side-menu-title" tabIndex={0}>Talento Humano</div>
        <div className="side-menu-items">
          <Link to="/empleados" className={pathname.startsWith('/empleados') ? 'active' : ''}>Empleados</Link>
        </div>
      </div>
      <div className="side-menu-section">
        <div className="side-menu-title" tabIndex={0}>Clientes</div>
        <div className="side-menu-items">
          <Link to="/tipos-cliente" className={pathname.startsWith('/tipos-cliente') ? 'active' : ''}>Tipos de cliente</Link>
          <Link to="/clientes" className={pathname.startsWith('/clientes') ? 'active' : ''}>Clientes</Link>
        </div>
      </div>
      <div className="side-menu-section">
        <div className="side-menu-title" tabIndex={0}>Proveedores</div>
        <div className="side-menu-items">
          <Link to="/proveedores" className={pathname.startsWith('/proveedores') ? 'active' : ''}>Proveedores (Persona)</Link>
        </div>
      </div>
    </aside>
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
        <TopBar />
        <div className="main-layout">
          <SideMenu />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/empresas" element={<EmpresaPage />} />
              <Route path="/sucursales" element={<SucursalPage />} />
              <Route path="/puntos-emision" element={<PuntoEmisionPage />} />
              <Route path="/roles" element={<RolPage />} />
              <Route path="/usuarios" element={<UsuarioPage />} />
              <Route path="/empleados" element={<EmpleadoPage />} />
              <Route path="/tipos-cliente" element={<TipoClientePage />} />
              <Route path="/clientes" element={<ClientePage />} />
              <Route path="/proveedores" element={<ProveedorPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
