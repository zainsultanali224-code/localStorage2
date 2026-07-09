import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";


function handleForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email first.", {
                position: "bottom-center"
            })
            return
        }

        try {
            await sendPasswordResetEmail(auth, email)

            toast.success("Password reset email sent. Please check your inbox.", {
                position: "top-center"
            })
        } catch (error) {
            console.log(error.message)
            toast.error(error.message, {
                position: "bottom-center"
            })
        }

    }

    return (
        <>
            <h2>Forgot Password?</h2>
            <div>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <button onClick={handleForgotPassword}>
                    Submit
                </button>
            </div>
        </>
    )
}

export default handleForgotPassword;
