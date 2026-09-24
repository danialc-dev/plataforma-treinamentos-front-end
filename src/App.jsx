import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import PainelAdmin from './components/admin/PainelAdmin.jsx'
import Inicio from './pages/admin/inicio.jsx'
import Relatorios from './pages/admin/relatorios.jsx'
import Relatorio from './pages/admin/relatorio.jsx'
import Treinamentos from './pages/admin/treinamentos.jsx'
import Colaboradores from './pages/admin/colaboradores.jsx'
import PainelColaborador from './components/colaborador/PainelColaborador.jsx'
import InicioColaborador from './pages/colaborador/inicio.jsx'
import AreaTreinamentos from './components/colaborador/AreaTreinamentos.jsx'
import TreinamentosColaborador from './pages/colaborador/treinamentos.jsx'
import TreinamentoColaborador from './pages/colaborador/treinamento.jsx'

function ProtectedRoute({ adminOnly = false, children }) {
  const identity = JSON.parse(localStorage.getItem('identity') || 'null')

  if (!identity) return <Navigate to="/" replace />
  if (adminOnly && !identity.isAdmin) return <Navigate to="/colaborador" replace />

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><PainelAdmin /></ProtectedRoute>}>
          <Route index element={<Inicio />} />
          <Route path="treinamentos" element={<Treinamentos />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="relatorios/:tipo" element={<Relatorio />} />
          <Route path="colaboradores" element={<Colaboradores />} />
        </Route>
        <Route path="/colaborador" element={<ProtectedRoute><PainelColaborador /></ProtectedRoute>}>
          <Route index element={<InicioColaborador />} />
          <Route path="progresso" element={<InicioColaborador />} />
          <Route element={<AreaTreinamentos />}>
            <Route path="treinamentos" element={<TreinamentosColaborador />} />
            <Route path="treinamentos/:id" element={<TreinamentoColaborador />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
