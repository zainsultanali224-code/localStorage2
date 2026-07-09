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
                                       <p
                                        style={{ color: "blue", cursor: "pointer" }}
                                        onClick={() => {
                                            navigate("/handleForgotPassword")
                                        }}
                                    >
                                        Forgot Password?

                                    </p>
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


                                    <SignInWithGoogle />
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </div>
    );
}

export default Login;
