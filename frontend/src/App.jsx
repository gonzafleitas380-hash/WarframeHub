import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Catalogo from './components/Catalogo.jsx';
import WarframePage from './components/warframe/WarframePage.jsx';
import Login from './components/Login.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/warframe/:nombre" element={<WarframePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Login />} />
    </Routes>
  );
}

export default App;