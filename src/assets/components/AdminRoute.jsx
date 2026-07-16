import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const user = auth.currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef, {source: 'server'});

            if (docSnap.exists()) {
                const userData = docSnap.data();

                if (userData.role === "admin") {
                    setIsAdmin(true);
                }
            }
            setLoading(false);
        };
        checkAdmin();
    }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to = "/login" />;
}
export default AdminRoute;