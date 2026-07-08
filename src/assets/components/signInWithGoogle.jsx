import google from "./google.png";
import "./index.css"
function SignInWithGoogle() {
    return(
        <div>
            <p className="continue-p">--Or continue with--</p>
            <img src={google} alt="Google" width="60%" />
        </div>
    )
}


export default SignInWithGoogle;