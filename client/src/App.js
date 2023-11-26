import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Clients from './components/Clients';
import Client from './components/Client';
import Header from './components/Header';
import CreateClient from './components/CreateClient';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Register } from './components/Register';

function App() {
  const location = useLocation();
  const isUserLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <div className='wrapper'>
      <div className='container'>
        {isUserLoggedIn && <Header />}
        <AnimatePresence
          mode='wait'
          initial={false}
        >
          <Routes key={location.pathname} location={location}>
            <Route element={<ProtectedRoute />} >
              <Route path='/' element={<Clients />} />
              <Route path='/:clientId' element={<Client />} />
              <Route path='/create-client' element={<CreateClient />} />
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
