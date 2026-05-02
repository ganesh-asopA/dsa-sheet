import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.code}>404</div>
      <h2 className={styles.title}>Page not found</h2>
      <p className={styles.sub}>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className={styles.btn}>Go to Dashboard</Link>
    </div>
  );
}

export default NotFound;
