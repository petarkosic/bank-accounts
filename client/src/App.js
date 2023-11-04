import './App.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Clients from './components/Clients';
import Client from './components/Client';
import Header from './components/Header';
import CreateClient from './components/CreateClient';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  const isUserLoggedIn = !!localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn) {
      return navigate('/login');
    }
  }, [isUserLoggedIn, navigate])


  return (
    <div className='wrapper'>
      <div className='container'>
        {!isUserLoggedIn && (
          <Routes>
            <Route path='/login' element={<Login />} />
          </Routes>
        )}
        {isUserLoggedIn && (
          <>
            <Header />
            <AnimatePresence
              mode='wait'
              initial={false}
            >
              <Routes key={location.pathname} location={location}>
                <Route path='/' element={<Clients />} />
                <Route path='/:clientId' element={<Client />} />
                <Route path='/create-client' element={<CreateClient />} />
                <Route path='/dashboard' element={<Dashboard />} />
              </Routes>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
