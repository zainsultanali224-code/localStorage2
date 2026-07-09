import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";

function HandleForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email first.", {
                position: "bottom-center"
            });
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);

            toast.success("Password reset email sent. Please check your inbox.", {
                position: "top-center"
            });
        } catch (error) {
            console.log(error);
            console.log("Code:", error.code);
            console.log("Message:", error.message);

            toast.error(error.message, {
                position: "bottom-center"
            });
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div
                    className="card shadow-lg p-4 rounded-4"
                    style={{ width: "100%", maxWidth: "420px" }}
                >
                    <h2 className="text-center mb-4">Forgot Password?</h2>

                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button
                            onClick={handleForgotPassword}
                            className="btn btn-primary btn-lg"
                        >
                            Submit
                        </button>
                    </div>

                    <div className="text-center mt-3">
                        <Link to="/" className="text-decoration-none">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HandleForgotPassword;