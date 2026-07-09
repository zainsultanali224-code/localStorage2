import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Search } from "../../todolist";
import { collection, getDocs } from "firebase/firestore";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;
    let isMounted = true;

    const setupListener = () => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Profile - Auth state changed, user:", user?.uid);

        if (!isMounted) return;

        if (!user) {
          console.log("No user, redirecting to login");
          setUserDetails(null);
          setCurrentUser(null);
          setLoading(false);
          navigate("/login");
          return;
        }

        setCurrentUser(user);

        try {
          console.log("Fetching user data for UID:", user.uid);
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef, { source: 'server' });

          console.log("Document exists:", docSnap.exists());

          if (!isMounted) return;

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
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  async function handleLogout() {
    try {
      console.log("Logging out...");
      setUserDetails(null);
      setCurrentUser(null);
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
          <Search userId={currentUser?.uid} />
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

export default Profile;


