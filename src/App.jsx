import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Dictionary from './pages/Dictionary'
import NotFound from './pages/NotFound'

function App() {
  const RenderRoute = () => (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dictionary' element={<Dictionary />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

  return (
    <>
      {RenderRoute()}
    </>
  )
}

export default App