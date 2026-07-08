import google from "./google.png";
import "../../index.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";

function SignInWithGoogle() {
    const navigate = useNavigate(); 

    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(result.user);

            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    firstName: user.displayName?.split(" ")[0] || "",
                    lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
                    email: user.email,
                    createdAt: new Date(),
                });
            }

            toast.success("User logged in successfully", {
                position: "top-center"
            })
            
            navigate("/profile_t");
            
        } catch (error) {
            console.error(error);
            toast.error(error.message, {
                position: "top-center",
            });
        }
    };

    return (
        <div>
            <p className="continue-p">--Or continue with--</p>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
                onClick={googleLogin}
            >
                <img src={google} alt="Google" width="60%" />
            </div>
        </div>
    );
}

export default SignInWithGoogle;