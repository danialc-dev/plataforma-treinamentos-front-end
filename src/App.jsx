import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import PainelAdmin from './components/admin/PainelAdmin.jsx'
import Inicio from './pages/admin/inicio.jsx'
import Relatorios from './pages/admin/relatorios.jsx'
import Relatorio from './pages/admin/relatorio.jsx'
import Treinamentos from './pages/admin/treinamentos.jsx'
import Colaboradores from './pages/admin/colaboradores.jsx'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
