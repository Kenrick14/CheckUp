import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
      <div className="container-fluid px-4">

        <Link className="navbar-brand fw-500" to="/" style={{ fontSize: '18px' }}>
          CheckUp
        </Link>

        <div className="d-flex gap-3">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'fw-500 text-dark' : 'text-muted'}`}
            style={{ fontSize: '14px' }}
          >
            Player Search
          </Link>
          <Link
            to="/stats"
            className={`nav-link ${location.pathname === '/stats' ? 'fw-500 text-dark' : 'text-muted'}`}
            style={{ fontSize: '14px' }}
          >
            Season Averages
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;