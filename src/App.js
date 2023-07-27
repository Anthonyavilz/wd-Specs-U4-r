import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import './App.css'
import AuthContext from './store/authContext'

import Header from './components/Header'
import Home from './components/Home'
import Auth from './components/Auth'
import Form from './components/Form'
import Profile from './components/Profile'

const App = () => {

  const authCtx = useContext(AuthContext)

  return (
    <div className='app'>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={!authCtx.token ? <Auth/> : <Navigate to='/' />}/>
        <Route path='/form' element={authCtx.token ? <Form/> : <Navigate to='/auth'/>}/>
        <Route path='/profile' element={authCtx.token ? <Profile/> : <Navigate to='/auth' />}/>
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    </div>
  )
}

export default App

// Logic above reads:
//    - If theres NOT an authCtx token then take them to the auth homepage (aka login page), otherwise take them to the home
//    - If there exist a token then navigate them to the appropriate pages, if not then navigate them back to the login/signup page