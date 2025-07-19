import './index.css';
import MainPage from './pages/MainPage/MainPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <div>
      <ErrorBoundary>
        <MainPage></MainPage>
      </ErrorBoundary>
    </div>
  );
}
export default App;
