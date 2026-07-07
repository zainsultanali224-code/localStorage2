import { useState } from 'react'
import  SignupForm  from './tasklist'
import { Search, EditTask } from './todolist';  
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './assets/components/login';
import Register from './assets/components/register';

import { ToastContainer } from 'react-toastify';



export default function App() {
  return(
  <>
  <BrowserRouter>
  <div className='App'>
    <div className='auth-wrapper'>
      <div className='auth-inner'>
        <Routes>
        <Route path='/' element ={<Login />} />
        <Route path='/login' element ={<Login />} />
        <Route path='/register' element ={<Register />} />
        </Routes>
        <ToastContainer/>
      </div>
    </div>
  </div>
  </BrowserRouter>

   <BrowserRouter>
   <Routes>
     <Route path="/" element={<Search />} />
     <Route path='/add-task' element={<SignupForm />}/>
     <Route path='/edit-Task/:id' element={<EditTask />}/>  
   </Routes>
   </BrowserRouter>       
  </>
  )
}
