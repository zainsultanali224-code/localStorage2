import { useState } from 'react'
import  SignupForm  from './tasklist'
import { Search, EditTask } from './todolist';  
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';



export default function App() {
  return(
   <BrowserRouter>
   <Routes>
     <Route path="/" element={<Search />} />
     <Route path='/add-task' element={<SignupForm />}/>
     <Route path='/edit-Task/:id' element={<EditTask />}/>  
   </Routes>
   </BrowserRouter>       
  )
}