import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BasketballU() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 1px' }}>
      <circle cx="11" cy="11" r="10" fill="#f97316" />
      <path d="M11 1 Q11 11 11 21" stroke="#1a1d27" strokeWidth="1.5" fill="none" />
      <path d="M1 11 Q11 11 21 11" stroke="#1a1d27" strokeWidth="1.5" fill="none" />
      <path d="M3.5 4.5 Q11 11 3.5 17.5" stroke="#1a1d27" strokeWidth="1.5" fill="none" />
      <path d="M18.5 4.5 Q11 11 18.5 17.5" stroke="#1a1d27" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    fontSize: '14px',
    padding: '6px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    color: location.pathname === path ? '#f97316' : '#9ca3af',
    backgroundColor: location.pathname === path ? 'rgba(249,115,22,0.1)' : 'transparent',
    fontWeight: location.pathname === path ? '500' : '400',
  });

  return (
    <nav style={{
      backgroundColor: '#13151f',
      borderBottom: '1px solid #2a2d3a',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontSize: '22px',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          color: '#f1f1f1',
          fontFamily: "'Georgia', serif",
        }}>
          Ch<span style={{ color: '#f97316' }}>e</span>ck
          <BasketballU />
          p
        </span>
      </Link>

      {/* nav links */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to="/" style={linkStyle('/')}>
          Compare
        </Link>
        <Link to="/stats" style={linkStyle('/stats')}>
          Season Averages
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;