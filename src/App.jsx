import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Notfound from './pages/Notfound/Notfound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PostDetails from './pages/PostDetails/PostDetails';
import toast, { Toaster } from 'react-hot-toast';
import Profile from './pages/Profile/Profile';


function App() {
  const [count, setCount] = useState(0)
  let routes = createBrowserRouter([
    {
      path: '/', element: <Layout />, children: [
        { index: true, element: <Login /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/home', element: <ProtectedRoute><Home /></ProtectedRoute> },
       {path:'/PostDetails/:id', element: <ProtectedRoute><PostDetails /></ProtectedRoute>},
               { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },

       { path: '*', element: <Notfound /> },

      ]
    }
  ])

  return (
 <>
    < RouterProvider router={routes}>



    </RouterProvider>
    <Toaster/>
 </>


  )
}

export default App
