import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogOut, Shield, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: 'rgba(15, 17, 21, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 1000,
      padding: '1rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Film color="var(--accent-primary)" size={28} />
          <span className="text-gradient">CineBooking</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              {!isAdmin && (
                <Link to="/dashboard" className="btn btn-secondary">
                  <Ticket size={18} /> My Bookings
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary" style={{ borderColor: 'var(--accent-primary)' }}>
                  <Shield size={18} /> Admin Panel
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  {user.username}
                </span>
                <button onClick={handleLogout} className="btn" style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn" style={{ color: 'white' }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
