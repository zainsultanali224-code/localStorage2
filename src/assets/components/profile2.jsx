import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import SignupForm from "../../tasklist";
import EditTask from "../../todolist";
import { Search } from "../../todolist";

function Profile_t() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;

    const setupListener = () => {
      unsubscribe = auth.onAuthStateChanged(async (user) => {
        console.log("Auth state changed, user:", user?.uid);

        if (!user) {
          console.log("No user, redirecting to login");
          setLoading(false);
          navigate("/login");
          return;
        }

        try {
          console.log("Fetching user data for UID:", user.uid);
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          console.log("Document exists:", docSnap.exists());

          if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
            setUserDetails(docSnap.data());
          } else {
            console.log("Document not found for UID:", user.uid);
            setUserDetails(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err.message);
          setUserDetails(null);
        } finally {
          setLoading(false);
        }
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigate]);

  async function handleLogout() {
    try {
      console.log("Logging out...");
      await auth.signOut();
      console.log("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {userDetails ? (
        <>
         
          {/* <h3>Welcome {userDetails.firstName}</h3> */}
          {/* <div>
            <p>Email: {userDetails.email}</p>
            <p>First Name: {userDetails.firstName}</p>
            <p>Last Name: {userDetails.lastName}</p>
          </div> */}
           <SignupForm />
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <p>User data not found.</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            Back to Login
          </button>
        </>
      )}
    </div>
  );
}

export default Profile_t;