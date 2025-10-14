import './App.css';
import Login from './pages/login.jsx';
import CriarConta from './pages/CriarConta.jsx';
import Home from './pages/Home.jsx';
import EsqueciSenha from './pages/EsqueciSenha.jsx';
import ResetSenha from './pages/ResetSenha.jsx';
import CriarProjeto from './pages/CriarProjeto.jsx';
import Projeto from './pages/projeto.jsx';
import EditarProjeto from './pages/EditaProjeto.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/CriarConta" element={<CriarConta />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/EsqueciSenha" element={<EsqueciSenha />} />
        <Route path="/ResetSenha" element={<ResetSenha />} />
        <Route path="/criar-projeto" element={<CriarProjeto />} />
        <Route path="/projeto" element={<Projeto />} />
        <Route path='projeto/Editar-Projeto' element={<EditarProjeto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;