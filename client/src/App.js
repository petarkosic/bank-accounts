import './App.css';
import { Routes, Route } from 'react-router-dom';
import Clients from './components/Clients';
import Client from './components/Client';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Clients />} />
        <Route path='/:clientId' element={<Client />} />
      </Routes>
    </div>
  );
}

export default App;
