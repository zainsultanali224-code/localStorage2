import {useEffect, useState } from 'react'
import SignupForm from './tasklist'
import { auth } from "./assets/components/firebase";
import { Search, EditTask } from './todolist';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';

import Login from './assets/components/login';
import Register from './assets/components/register';
import Profile from './assets/components/profile';

import { ToastContainer } from 'react-toastify';



export default function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <>
      <BrowserRouter>
        <div className='App'>
          <div className='auth-wrapper'>
            <div className='auth-inner'>
              <Routes>
                <Route path="/" element={user ? <Navigate to="/profile" /> : <Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile />} />
              </Routes>
              <ToastContainer />
            </div>
          </div>
        </div>
      </BrowserRouter>
{/* 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path='/add-task' element={<SignupForm />} />
          <Route path='/edit-Task/:id' element={<EditTask />} />
        </Routes>
      </BrowserRouter> */}
    </>
  )
}
