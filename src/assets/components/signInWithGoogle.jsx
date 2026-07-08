import google from "./google.png";
import "../../index.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";

function SignInWithGoogle() {
    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);

            if (result.user) {
                console.log(result.user);

                toast.success("User logged in successfully!", {
                    position: "top-center",
                });

                // Redirect after login
                navigate("/profile2");
            }
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