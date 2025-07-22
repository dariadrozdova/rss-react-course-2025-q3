import ErrorBoundary from '@components/ErrorBoundary';
import { NavLink, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="app-container">
      <nav className="main-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </li>
        </ul>
      </nav>

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}

export default App;
