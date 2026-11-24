import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Home from './components/Home';
import Contacts from './components/Contacts';
import Groups from './components/Groups';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">SIMONA</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a 
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${currentPage === 'contacts' ? 'active' : ''}`}
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage('contacts'); }}
                >
                  Upload Laporan
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${currentPage === 'groups' ? 'active' : ''}`}
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage('groups'); }}
                >
                  Laporan Kegiatan
                </a>
              </li>
              <li className="nav-item">
                <span className="nav-link">User: {user.username}</span>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleLogout(); }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        {currentPage === 'home' && <Home />}
        {currentPage === 'contacts' && <Contacts />}
        {currentPage === 'groups' && <Groups />}
      </div>
    </div>
  );
}

export default App;
