import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser, getUser } from '../services/authService';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>DS</span>
          DSA Sheet
        </Link>
        <div className={styles.links}>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? styles.active : ''}>
            Dashboard
          </Link>
          <Link to="/sheet" className={location.pathname === '/sheet' ? styles.active : ''}>
            Problems
          </Link>
        </div>
        <div className={styles.right}>
          <div className={styles.avatar}>{initials}</div>
          <span className={styles.userName}>{user?.name}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
