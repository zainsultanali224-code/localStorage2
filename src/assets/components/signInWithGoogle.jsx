import google from "./google.png";
import "../../index.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

function SignInWithGoogle() {
    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (result) => {
            console.log(result)
        })
    }
    return(
        <div>
            <p className="continue-p">--Or continue with--</p>
            <div
             style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
            >
            <img src={google} alt="Google" width="60%" />
            </div>
        </div>
    )
}


export default SignInWithGoogle;