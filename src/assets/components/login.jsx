import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Container, Row, Col, Card, Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import "./Login.css";
import SignInWithGoogle from "./signInWithGoogle";
import handleForgotPassword from "./handleForgotPassword";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [resetEmail, setResetEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);

            toast.success("Login Successful!", {
                position: "top-center",
                autoClose: 1500,
            });

            setTimeout(() => {
                navigate("/profile");
            }, 1000);
        } catch (error) {
            console.log(error);
            console.log("Code:", error.code);
            console.log("Message:", error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });

            setLoading(false);
        }
    };

    // const handleForgotPassword = async () => {
    //     if (!email) {
    //         toast.error("Please enter your email first.",{
    //             position: "bottom-center"
    //         })
    //         return
    //     }

    //     try {
    //         await sendPasswordResetEmail(auth, email);

    //         toast.success("Password reset email sent. Please check your inbox.", {
    //             position: "top-center"
    //         })
    //     } catch (error) {
    //         console.log(error.message)

    //         toast.error(error.message,{
    //             position: "bottom-center"
    //         })
    //     }
    // }

    // const handleForgotPasswordStep1 = async () => {
    //     if (!resetEmail) {
    //         toast.error("Please enter your email");
    //         return;
    //     }

    //     setResetLoading(true);

    //     const actionCodeSettings = {
    //         url: window.location.origin + "/reset-password",
    //         handleCodeInApp: true,
    //     };

    //     try {
    //         await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
    //         console.log("✅ Email sent to:", resetEmail);

    //         toast.success("Verification code sent to your email!", {
    //             position: "top-center",
    //         });

    //         setForgotStep(2);
    //         setResetLoading(false);
    //     } catch (error) {
    //         console.error("❌ Error sending email:", error);
    //         toast.error(error.message, {
    //             position: "bottom-center",
    //         });
    //         setResetLoading(false);
    //     }
    // };

    // const handleForgotPasswordStep2 = () => {
    //     if (!resetCode) {
    //         toast.error("Please enter verification code");
    //         return;
    //     }
    //     setForgotStep(3); 
    // };

    // const handleForgotPasswordStep3 = async () => {
    //     if (newPassword !== confirmPassword) {
    //         toast.error("Passwords do not match");
    //         return;
    //     }
    //     if (newPassword.length < 6) {
    //         toast.error("Password must be at least 6 characters");
    //         return;
    //     }

    //     setResetLoading(true);

    //     try {
    //         console.log("🔄 Resetting password with code:", resetCode);

    //         await confirmPasswordReset(auth, resetCode, newPassword);

    //         console.log("✅ Password changed successfully!");

    //         toast.success("Password changed successfully! Login with new password.", {
    //             position: "top-center",
    //             autoClose: 2000,
    //         });

    //         setShowForgotModal(false);
    //         setForgotStep(1);
    //         setResetEmail("");
    //         setResetCode("");
    //         setNewPassword("");
    //         setConfirmPassword("");
    //         setResetLoading(false);
    //     } catch (error) {
    //         console.error("❌ Error resetting password:", error);
    //         toast.error("Invalid code or error: " + error.message, {
    //             position: "bottom-center",
    //         });
    //         setResetLoading(false);
    //     }
    // };

    // const closeForgotModal = () => {
    //     setShowForgotModal(false);
    //     setForgotStep(1);
    //     setResetEmail("");
    //     setResetCode("");
    //     setNewPassword("");
    //     setConfirmPassword("");
    //     setResetLoading(false);
    // };

    return (
        <div className="login-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} sm={10} md={8} lg={5}>
                        <Card className="login-card shadow-lg border-0">
                            <Card.Body className="p-5">
                                <form onSubmit={handleSubmit}>
                                    <h3 className="text-center mb-4 fw-bold">
                                        Login
                                    </h3>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            disabled={loading}
                                            required
                                        />
                                        <div>
                                            <p
                                                onClick={() => setShowForgotModal(true)}
                                                style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
                                            >
                                                Forgot Password?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Logging in..."
                                                : "Login"}
                                        </button>
                                    </div>

                                    <p className="text-center mt-4 mb-3">
                                        New user?{" "}
                                        <Link
                                            to="/register"
                                            className="fw-semibold text-decoration-none"
                                        >
                                            Register Here
                                        </Link>
                                    </p>

                                    <p
                                        style={{ color: "blue", cursor: "pointer" }}
                                        onClick={() => {
                                            navigate("/handleForgotPassword")
                                        }}
                                    >
                                        Forgot Password?

                                    </p>

                                    <SignInWithGoogle />
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* 🔹 FORGOT PASSWORD MODAL
            <Modal show={showForgotModal} onHide={closeForgotModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    📧 STEP 1: Email enter
                    {forgotStep === 1 && (
                        <>
                            <p>Enter your email address and we'll send you a code.</p>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    disabled={resetLoading}
                                />
                            </Form.Group>
                        </>
                    )}

                    🔐 STEP 2: Verification code enter
                    {forgotStep === 2 && (
                        <>
                            <p>Check your email for a verification code and enter it below.</p>
                            <Form.Group className="mb-3">
                                <Form.Label>Verification Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter code from email"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    disabled={resetLoading}
                                />
                            </Form.Group>
                        </>
                    )}

                    🔑 STEP 3: New password set
                    {forgotStep === 3 && (
                        <>
                            <p>Enter your new password.</p>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={resetLoading}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={resetLoading}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeForgotModal}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={
                            forgotStep === 1
                                ? handleForgotPasswordStep1
                                : forgotStep === 2
                                ? handleForgotPasswordStep2
                                : handleForgotPasswordStep3
                        }
                        disabled={resetLoading}
                    >
                        {resetLoading ? "Loading..." : ""}
                        {!resetLoading && forgotStep === 1 && "Send Code"}
                        {!resetLoading && forgotStep === 2 && "Next"}
                        {!resetLoading && forgotStep === 3 && "Change Password"}
                    </Button>
                </Modal.Footer>
            </Modal> */}

            <ToastContainer />
        </div>
    );
}

export default Login;
