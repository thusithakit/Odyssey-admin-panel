import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import ListView from './pages/ListView'
import Layout from './pages/Layout'
import UpdateHotel from './pages/UpdateHotel'
import UpdateResturant from './pages/UpdateResturant'
import AddHotel from './pages/AddHotel'
import AddResturant from './pages/AddResturant'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view/:apiName"
              element={
                <ProtectedRoute>
                  <ListView />
                </ProtectedRoute>
              }
            />
            <Route
              path='/edit/hotels/:id'
              element={
                <ProtectedRoute>
                  <UpdateHotel />
                </ProtectedRoute>
              }
            />
            <Route
              path='/edit/restaurants/:id'
              element={
                <ProtectedRoute>
                  <UpdateResturant />
                </ProtectedRoute>
              }
            />
            <Route
              path='/add/hotels'
              element={
                <ProtectedRoute>
                  <AddHotel />
                </ProtectedRoute>
              }
            />

            <Route
              path='/add/restaurants'
              element={
                <ProtectedRoute>
                  <AddResturant />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
