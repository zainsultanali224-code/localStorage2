import { useEffect, useState } from 'react';
import { auth } from "./assets/components/firebase";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './assets/components/login';
import Register from './assets/components/register';
import Profile from './assets/components/profile';
import { ToastContainer } from 'react-toastify';
import SignupForm from "./tasklist";
import EditTask from "./todolist";
import Profile_t from './assets/components/profile2';
import HandleForgotPassword from "./assets/components/handleForgotPassword";
import Admin from './assets/components/admin';
import AdminRoute from './assets/components/AdminRoute';
import UsersTodos from './assets/components/adminShowAll';
import UserAnalytics from './assets/components/UserAnalytics';
import TotalUsers from './assets/components/TotalUsers';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("App.jsx - Auth state changed, user:", currentUser?.uid);
      setUser(currentUser);
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
                  path='/profile'
                  element={user ? <Profile key={user.uid} /> : <Navigate to="/login" />}
                />
                
                <Route
                  path='/profile_t'
                  element={user ? <Profile_t key={user.uid} /> : <Navigate to="/login" />}
                />

                <Route
                  path='/add-task'
                  element={user ? <SignupForm /> : <Navigate to="/login" />}
                />

                <Route
                  path='/edit-Task/:id'
                  element={user ? <EditTask /> : <Navigate to="/login" />}
                />

                <Route
                  path='/login'
                  element={user ? <Navigate to="/profile" /> : <Login />}
                />

                <Route path="/handleForgotPassword" element={<HandleForgotPassword />} />

                <Route
                  path='/register'
                  element={user ? <Navigate to="/profile" /> : <Register />}
                />

                <Route
                  path="/"
                  element={user ? <Navigate to="/profile" /> : <Navigate to="/login" />}
                />
              
                <Route
                  path="/admin"
                  element={ user ? (<AdminRoute>
                    <Admin />
                  </AdminRoute>) : <Navigate to="/login" /> } />

                <Route
                  path="/adminShowAll"
                  element={ user ? (<AdminRoute>
                    <UsersTodos />
                  </AdminRoute>) : <Navigate to="/login" /> } />

                  <Route
                  path="/userAnalytics"
                  element={ user ? (<AdminRoute>
                    <UserAnalytics />
                  </AdminRoute>) : <Navigate to="/login" /> } />

                  <Route
                  path="/totalUsers"
                  element={ user ? (<AdminRoute>
                    <TotalUsers />
                  </AdminRoute>) : <Navigate to="/login" /> } />

              </Routes>
              <ToastContainer />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}

