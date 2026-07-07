import { useEffect, useState } from 'react'
import { auth } from "./assets/components/firebase";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './assets/components/login';
import Register from './assets/components/register';
import Profile from './assets/components/profile';
import { ToastContainer } from 'react-toastify';





export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("App.jsx - Auth state changed, user:", user?.uid);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <div className='App'>
          <div className='auth-wrapper'>
            <div className='auth-inner'>
              <Routes>
                <Route
                  path="/"
                  element={user ? <Navigate to="/profile" /> : <Navigate to="/login" />}
                />
                <Route
                  path='/login'
                  element={user ? <Navigate to="/profile" /> : <Login />}
                />
                <Route
                  path='/register'
                  element={user ? <Navigate to="/profile" /> : <Register />}
                />
                <Route
                  path='/profile'
                  element={user ? <Profile /> : <Navigate to="/login" />}
                />
              </Routes>
              <ToastContainer />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}
