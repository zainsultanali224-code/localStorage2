import google from "./google.png";
import "../../index.css";

function SignInWithGoogle() {
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