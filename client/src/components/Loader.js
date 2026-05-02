import React from 'react';
import styles from './Loader.module.css';

function Loader({ text = 'Loading...' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default Loader;
