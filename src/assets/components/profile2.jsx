import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import SignupForm from "../../tasklist";

function Profile_t() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;

    const setupListener = () => {
      unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setLoading(false);
          navigate("/login");
          return;
        }

        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            setUserDetails(null);
          }
        } catch (err) {
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
      setUserDetails(null);
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      setUserDetails(null);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {userDetails ? (
        <>
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