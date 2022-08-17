import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Clients from './components/Clients';
import Client from './components/Client';
import Header from './components/Header';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <div className='wrapper'>
      <div className='container'>
        <Header />
        <AnimatePresence
          mode='wait'
          initial={false}
        >
          <Routes key={location.pathname} location={location}>
            <Route path='/' element={<Clients />} />
            <Route path='/:clientId' element={<Client />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
