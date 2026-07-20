import { useEffect } from 'react';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';
import Login from './assets/components/login';
import Register from './assets/components/register';
import Profile from './assets/components/profile';
import { ToastContainer } from 'react-toastify';
import SignupForm from "./tasklist";
import EditTask from "./todolist";
import Profile_t from './assets/components/profile2';
import HandleForgotPassword from "./assets/components/handleForgotPassword";
import Admin from "./assets/components/admin";
import AdminRoute from './assets/components/AdminRoute';
import UsersTodos from './assets/components/adminShowAll';
import UserAnalytics from './assets/components/UserAnalytics';
import TotalUsers from './assets/components/TotalUsers';
import { Container, Spinner } from "react-bootstrap";
import ProfileDetail from './PfDetail';
import './index.css'

export default function App() {


  const dispatch = useDispatch();
  const {
    isAuthenticated,
    authLoading,
    checkingAuth,
    user,
  } = useSelector((state) => state.auth);

  const { mode } = useSelector(
    (state) => state.theme
  );
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>

      <BrowserRouter>
      <div className={mode}>
        <div className='App'>
          <div className='auth-wrapper'>
            <div className='auth-inner'>
              <Routes>
                <Route
                  path='/profile'
                  element={isAuthenticated ? <Profile key={user?.uid} /> : <Navigate to="/login" />}
                />

                <Route
                  path='/profile_t'
                  element={isAuthenticated ? <Profile_t key={user?.uid} /> : <Navigate to="/login" />}
                />

                <Route
                  path='/add-task'
                  element={isAuthenticated ? <SignupForm /> : <Navigate to="/login" />}
                />

                <Route
                  path='/edit-Task/:id'
                  element={isAuthenticated ? <EditTask /> : <Navigate to="/login" />}
                />

                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      user?.role === "admin" ? (
                        <Navigate to="/admin" replace />
                      ) : (
                        <Navigate to="/profile" replace />
                      )
                    ) : (
                      <Login />
                    )
                  }
                />

                <Route path="/handleForgotPassword" element={<HandleForgotPassword />} />

                <Route
                  path='/register'
                  element={isAuthenticated ? <Navigate to="/profile" /> : <Register />}
                />

                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      user?.role === "admin" ? (
                        <Navigate to="/admin" replace />
                      ) : (
                        <Navigate to="/profile" replace />
                      )
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/admin"
                  element={
                    isAuthenticated ? (
                      <AdminRoute>
                        <Admin />
                      </AdminRoute>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/adminShowAll"
                  element={isAuthenticated ? (
                    <AdminRoute>
                      <UsersTodos />
                    </AdminRoute>
                  ) : <Navigate to="/login" />}
                />

                <Route
                  path="/userAnalytics"
                  element={isAuthenticated ? (
                    <AdminRoute>
                      <UserAnalytics />
                    </AdminRoute>
                  ) : <Navigate to="/login" />}
                />

                <Route
                  path="/totalUsers"
                  element={isAuthenticated ? (
                    <AdminRoute>
                      <TotalUsers />
                    </AdminRoute>
                  ) : <Navigate to="/login" />}
                />



              </Routes>
              <ToastContainer />
            </div>
          </div>
        </div>
        </div>
      </BrowserRouter>
    </>
  );
}