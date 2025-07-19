import styles from './Loader.module.css';

function Loader() {
  return (
    <div className={styles.loaderContainer} role="status" aria-live="polite">
      <div className={styles.spinner}></div>
      <p>Loading Pokemon...</p>
    </div>
  );
}

export default Loader;
