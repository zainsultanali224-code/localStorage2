import { useEffect, useState } from 'react'
import { auth } from "./assets/components/firebase";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './assets/components/login';
import Register from './assets/components/register';
import Profile from './assets/components/profile';
import { ToastContainer } from 'react-toastify';



// export default function App() {
//   const [user, setUser] = useState();
//   useEffect(() => {
//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     console.log("App User:", user);
//     setUser(user);
//   });

//   return () => unsubscribe();
// }, []);
//   return (
//     <>
//       <BrowserRouter>
//         <div className='App'>
//           <div className='auth-wrapper'>
//             <div className='auth-inner'>
//               <Routes>
//                 <Route path="/" element={user ? <Navigate to="/profile" /> : <Login />} />
//                 <Route path='/login' element={<Login />} />
//                 <Route path='/register' element={<Register />} />
//                 <Route path='/profile' element={<Profile />} />
//               </Routes>
//               <ToastContainer />
//             </div>
//           </div>
//         </div>
//       </BrowserRouter>
// {/* 
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Search />} />
//           <Route path='/add-task' element={<SignupForm />} />
//           <Route path='/edit-Task/:id' element={<EditTask />} />
//         </Routes>
//       </BrowserRouter> */}
//     </>
//   )
// }

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // ✅ Loading state add karo

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("App.jsx - Auth state changed, user:", user?.uid);
      setUser(user);
      setLoading(false);  // ✅ Loading complete
    });

    return () => unsubscribe();
  }, []);

  // ✅ Loading ke doran kuch mat render karo
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
                  element={user ? <Navigate to="/profile" /> : <Login />}  // ✅ Agar logged in hai to profile bhejo
                />
                <Route 
                  path='/register' 
                  element={user ? <Navigate to="/profile" /> : <Register />} // ✅ Agar logged in hai to profile bhejo
                />
                <Route 
                  path='/profile' 
                  element={user ? <Profile /> : <Navigate to="/login" />}  // ✅ Agar logged in nahi to login bhejo
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
