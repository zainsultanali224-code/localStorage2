import React, { useEffect, useState } from "react"
import { auth, db } from "./firebase"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [userDetails, setUserDetails] = useState(null)
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No user document found");
                }
            } else {
                console.log("User is not logged in");
            }
        });
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const navigate = useNavigate();
    async function handleLogout() {
        try {
            await auth.signOut();
            navigate("/login");
            console.log("User logged out successfully!");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    }
    return (
        <div>
            {userDetails ? (
                <>
                    <h3>Welcome {userDetails.firstName}</h3>
                    <div>
                        <p>Email: {userDetails.email}</p>
                        <p>FirstName: {userDetails.firstName}</p>
                        <p>LastName: {userDetails.lastName}</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Profile;