import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import "./Login.css";
import SignInWithGoogle from "./signInWithGoogle";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/profile";
            console.log("User Registered Successfully!!");
            toast.success("User Registered Successfully!!", {
                position: "top-center",
            });
        } catch (error) {
            console.log(error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });
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
                                        />
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                        >
                                            Login
                                        </button>
                                    </div>

                                    <p className="text-center mt-4 mb-0">
                                        New user{" "}
                                        <a
                                            href="/register"
                                            className="fw-semibold text-decoration-none"
                                        >
                                            Register Here
                                        </a>
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