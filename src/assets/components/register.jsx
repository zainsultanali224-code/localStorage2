import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../features/auth/authSlice";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center"
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Registration Successful!", {
                position: "top-center"
            });
            setEmail("");
            setPassword("");
            setFname("");
            setLname("");
            
            setTimeout(() => {
                navigate("/profile");
            }, 1000);
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fname || !email || !password) {
            toast.error("Please fill all required fields", {
                position: "bottom-center"
            });
            return;
        }

        dispatch(registerUser({ 
            email, 
            password, 
            firstName: fname, 
            lastName: lname 
        }));
    };

    return (
        <div className="register-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} sm={10} md={8} lg={5}>
                        <Card className="register-card shadow-lg border-0">
                            <Card.Body className="p-5">
                                <form onSubmit={handleRegister}>
                                    <h3 className="text-center fw-bold mb-4">
                                        Create Account
                                    </h3>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            value={fname}
                                            onChange={(e) => setFname(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name"
                                            value={lname}
                                            onChange={(e) => setLname(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Creating account..." : "Create Account"}
                                        </button>
                                    </div>

                                    <p className="text-center mt-4 mb-0">
                                        Already have an account?{" "}
                                        <a
                                            href="/login"
                                            className="text-decoration-none fw-semibold"
                                        >
                                            Login Here
                                        </a>
                                    </p>

                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default Register;