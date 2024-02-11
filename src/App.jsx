
import './App.css'

import {AuthContext} from '../src/context/AuthContext'
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
function App() {

 
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate()
  // console.log(currentUser)

  return (
  <>
  <Outlet></Outlet>
  </>
  )
}

export default App
