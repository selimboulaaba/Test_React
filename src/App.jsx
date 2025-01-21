import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Statistiques from './pages/dashboard/Statistiques'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<Dashboard />}>
          <Route path='' element={<Statistiques />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
