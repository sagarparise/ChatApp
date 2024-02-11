import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { RouterProvider, createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import Home from './components/Home.jsx'
import SignUp from './components/SignUp.jsx'
import LoginPage from './components/LoginPage.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<SignUp/>} />
      <Route path='/Home' element={<Home/>} />
      <Route path='/login' element={<LoginPage/>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
 
 <React.StrictMode>
   <AuthContextProvider>
      <ChatContextProvider>
        <RouterProvider router={router}></RouterProvider>
    </ChatContextProvider>
   </AuthContextProvider>
  </React.StrictMode>
)
