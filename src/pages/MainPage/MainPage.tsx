import { Component } from 'react';
import styles from './MainPage.module.css';

class MainPage extends Component {
  render() {
    return (
      <div className={styles.mainPageContainer}>
        <section className={styles.topSection}>
          <h2>Top Controls</h2>
        </section>

        <section className={styles.resultsSection}>
          <h2>Search Results</h2>
        </section>
      </div>
    );
  }
}

export default MainPage;
