import './App.css';
import { Routes, Route } from 'react-router-dom';
import Clients from './components/Clients';
import Client from './components/Client';
import Header from './components/Header';

function App() {
  return (
    <div className='wrapper'>
      <div className='container'>
        <Header />
        <Routes>
          <Route path='/' element={<Clients />} />
          <Route path='/:clientId' element={<Client />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
