import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SignupForm from "../../tasklist";
import EditTask from "../../todolist";
import { Search } from "../../todolist";

function Profile_t() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeAuth = null;
    let isMounted = true; // ✅ ADD

    const setupListener = () => {
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        console.log("Profile_t - Auth state changed, user:", user?.uid);

        if (!isMounted) return; // ✅ ADD

        if (!user) {
          console.log("No user, redirecting to login");
          setUserDetails(null);
          setLoading(false);
          navigate("/login");
          return;
        }

        try {
          console.log("Fetching user data for UID:", user.uid);
          const docRef = doc(db, "Users", user.uid);
          
          // ✅ ADD cache busting
          const docSnap = await getDoc(docRef, { source: 'server' });

          console.log("Document exists:", docSnap.exists());

          if (!isMounted) return; // ✅ ADD

          if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
            setUserDetails(docSnap.data());
          } else {
            console.log("Document not found for UID:", user.uid);
            setUserDetails(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err.message);
          if (isMounted) setUserDetails(null);
        } finally {
          if (isMounted) setLoading(false);
        }
      });
    };

    setupListener();

    return () => {
      isMounted = false; // ✅ ADD
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
  }, []); // ✅ CHANGE - empty dependency array

  async function handleLogout() {
    try {
      console.log("Logging out...");
      setUserDetails(null); // ✅ Clear first
      setLoading(true);
      await signOut(auth);
      console.log("Logged out successfully");
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
          <h2>Welcome, {userDetails.firstName}</h2>
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