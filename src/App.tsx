import { Component } from 'react';
import './index.css';
import MainPage from './pages/MainPage/MainPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

class App extends Component {
  render() {
    return (
      <div>
        <ErrorBoundary>
          <MainPage></MainPage>
        </ErrorBoundary>
      </div>
    );
  }
}
export default App;
