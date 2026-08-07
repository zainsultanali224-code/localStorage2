import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../features/auth/authSlice';
import Login from '../features/auth/components/login';
import Register from '../features/auth/components/register';
import Profile from '../features/admin/Profile/profile';
import { ToastContainer } from 'react-toastify';
import SignupForm from '../features/todo/components/tasklist';
import Profile_t from "../features/admin/Profile/profile2"
import HandleForgotPassword from '../features/auth/components/handleForgotPassword';
import Admin from '../features/admin/components/admin';
import AdminRoute from "../features/admin/components/AdminRoute"
import UsersTodos from '../features/admin/components/adminShowAll';
import UserAnalytics from '../features/admin/components/UserAnalytics';
import TotalUsers from '../features/admin/components/TotalUsers';
import { Container, Spinner } from "react-bootstrap";
import ProfileDetail from "../features/admin/Profile/PfDetail"
import '../assets/styles/index.css'

export default function App() {

  const dispatch = useDispatch();
  const {
    isAuthenticated,
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
                    path="/edit-Task/:id"
                    element={isAuthenticated ? <SignupForm /> : <Navigate to="/login" />}
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