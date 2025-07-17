import { PureComponent } from 'react';
import styles from './Loader.module.css';

class Loader extends PureComponent {
  render() {
    return (
      <div className={styles.loaderContainer} role="status" aria-live="polite">
        <div className={styles.spinner}></div>
        <p>Loading Pokemon...</p>
      </div>
    );
  }
}

export default Loader;
