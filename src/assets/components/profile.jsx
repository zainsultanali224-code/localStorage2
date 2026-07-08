import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SignupForm from "../../tasklist";
import EditTask from "../../todolist";
import { Search } from "../../todolist";

function Profile() {
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
          setUserDetails(null); // ✅ Data clear karo
          setLoading(false);
          navigate("/login");
          return;
        }

        try {
          console.log("Fetching user data for UID:", user.uid);
          // ❌ REMOVED: const user = auth.currentUser; (variable conflict)
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          console.log("Document exists:", docSnap.exists());

          if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
            setUserDetails(docSnap.data()); // ✅ Naye user ka data set karo
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

  // ✅ FIX: handleLogout ko properly likha
  async function handleLogout() {
    try {
      console.log("Logging out...");
      await signOut(auth);
      setUserDetails(null); // ✅ State clear karo
      setLoading(true);
      navigate("/login");
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
          <Search />
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