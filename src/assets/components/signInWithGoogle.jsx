import google from "./google.png";
import "../../index.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";


function SignInWithGoogle() {
    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (result) => {
            console.log(result);
            if (result.user) {
                toast.success("User Logged in successfully", {
                    position: "top-center"
                });
                window.location.href = "/profile2"
            }
        })
    }
    return(
        <div>
            <p className="continue-p">--Or continue with--</p>
            <div
             style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
             onClick={googleLogin}
            >
            <img src={google} alt="Google" width="60%" />
            </div>
        </div>
    )
}


export default SignInWithGoogle;