import styles from './Loader.module.css';

function Loader() {
  return (
    <div aria-live="polite" className={styles.loaderContainer} role="status">
      <div className={styles.spinner} />
      <p>Loading Pokemon...</p>
    </div>
  );
}

export default Loader;
