import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
 const fetchUserData = async () => {
    console.log("fetchUserData called");

    auth.onAuthStateChanged(async (user) => {
        console.log("Inside onAuthStateChanged");
        console.log(user);

        if (!user) {
            console.log("No user");
            return;
        }

        const docRef = doc(db, "Users", user.uid);
        console.log("DocRef created");

        const docSnap = await getDoc(docRef);

        console.log("Exists:", docSnap.exists());

        if (docSnap.exists()) {
            console.log(docSnap.data());
            setUserDetails(docSnap.data());
        } else {
            console.log("Document not found");
        }
    });
};
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
  return (
    <div>
      {userDetails ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={userDetails.photo}
              width={"40%"}
              style={{ borderRadius: "50%" }}
            />
          </div>
          <h3>Welcome {userDetails.firstName} 🙏🙏</h3>
          <div>
            <p>Email: {userDetails.email}</p>
            <p>First Name: {userDetails.firstName}</p>
            {/* <p>Last Name: {userDetails.lastName}</p> */}
          </div>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default Profile;