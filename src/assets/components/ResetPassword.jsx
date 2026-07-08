import React, { useState, useEffect } from "react";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { auth } from "./firebase";
import { Container, Row, Col, Card } from "react-bootstrap";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oobCode, setOobCode] = useState(null);
    const [validCode, setValidCode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // URL se oobCode nikalo
        const params = new URLSearchParams(window.location.search);
        const code = params.get("oobCode");

        console.log("📍 Full URL:", window.location.href);
        console.log("🔑 oobCode from URL:", code);

        if (!code) {
            console.error("❌ oobCode nahi mila URL me");
            toast.error("Invalid reset link - no code found");
            setLoading(false);
            return;
        }

        // Code ko verify karo
        verifyPasswordResetCode(auth, code)
            .then((email) => {
                console.log("✅ Code verified! Email:", email);
                setOobCode(code);
                setValidCode(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error("❌ Code verification failed:", error.code, error.message);
                
                if (error.code === "auth/expired-action-code") {
                    toast.error("Reset link expired. Please request a new one.");
                } else if (error.code === "auth/invalid-action-code") {
                    toast.error("Invalid reset link.");
                } else {
                    toast.error("Error: " + error.message);
                }
                setLoading(false);
            });
    }, []);

    const handleReset = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill both password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsResetting(true);

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            console.log("✅ Password reset successful!");
            
            toast.success("Password reset successful! Redirecting to login...", {
                position: "top-center",
                autoClose: 1500,
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.error("❌ Reset failed:", error.code, error.message);
            toast.error("Error resetting password: " + error.message);
            setIsResetting(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <div className="text-center">
                            <p>Verifying reset link...</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!validCode) {
        return (
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="shadow-lg">
                            <Card.Body className="text-center p-5">
                                <h4>Invalid or Expired Link</h4>
                                <p className="mt-3">The reset link is invalid or has expired.</p>
                                <button 
                                    onClick={() => navigate("/login")}
                                    className="btn btn-primary mt-3"
                                >
                                    Back to Login
                                </button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <h3 className="text-center mb-4 fw-bold">Set New Password</h3>

                            <form onSubmit={handleReset}>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isResetting}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isResetting}
                                        required
                                    />
                                </div>

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isResetting}
                                    >
                                        {isResetting ? "Resetting..." : "Reset Password"}
                                    </button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <ToastContainer />
        </Container>
    );
}

export default ResetPassword;