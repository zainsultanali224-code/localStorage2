import React, { useState, useEffect } from "react";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "./firebase";


function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oobCode, setOobCode] = useState("");
    const [validCode, setValidCode] = useState("");
    const [loading, setLoading] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const code = params.get("oobCode");

        if (!code) {
            toast.error("Invaild reset link.");
            setLoading(false)
            return;
        }

        setOobCode(code)

        verifyPasswordResetCode(auth, code)
            .then(() => {
                setValidCode(true)
                setLoading(false)
            })
            .catch(() => {
                toast.error("Reset link expired or invalid.");
                setLoading(false);
            })
    },[])

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
             toast.error("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6 ) {
             toast.error("Password must be at least 6 characters.");
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, newPassword)
                toast.success("Password reset successful! Please login.",{
                    position: "top-center"
                });
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            console.log(error.message)
            toast.error(error.message, {
                position: "bottom-center"
            });
        }

        if (loading) return <p className="text-center mt-5">Checking link...</p>;

        if (!validCode) return <p className="text-center mt-5">Invalid or expired reset link.</p>;
    }

    return(
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form onSubmit={handleReset} style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Set New Password</h3>

                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Reset Password
                </button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ResetPassword;
