import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import PainelAdmin from './components/admin/PainelAdmin.jsx'
import Inicio from './pages/admin/inicio.jsx'
import Relatorios from './pages/admin/relatorios.jsx'
import Relatorio from './pages/admin/relatorio.jsx'
import Treinamentos from './pages/admin/treinamentos.jsx'
import Colaboradores from './pages/admin/colaboradores.jsx'
import PainelColaborador from './components/colaborador/PainelColaborador.jsx'
import InicioColaborador from './pages/colaborador/inicio.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<PainelAdmin />}>
          <Route index element={<Inicio />} />
          <Route path="treinamentos" element={<Treinamentos />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="relatorios/:tipo" element={<Relatorio />} />
          <Route path="colaboradores" element={<Colaboradores />} />
        </Route>
        <Route path="/colaborador" element={<PainelColaborador />}>
          <Route index element={<InicioColaborador />} />
          <Route path="treinamentos" element={<InicioColaborador />} />
          <Route path="progresso" element={<InicioColaborador />} />
          <Route path="treinamentos/:id" element={<InicioColaborador />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
