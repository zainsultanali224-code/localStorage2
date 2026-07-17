import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import SignInWithGoogle from "./signInWithGoogle";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../features/auth/authSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const dispatch = useDispatch();
    const { isLoading, error, isAuthenticated, user } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            toast.success("Login Successful!", {
                position: "top-center",
                autoClose: 1500,
            });
            setTimeout(() => {
                if (user.role === "admin") {
                    navigate("/admin");
                    console.log(user);
                } else {
                    navigate("/profile");
                }
            }, 500);
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center",
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill all fields", {
                position: "bottom-center",
            });
            return;
        }

        dispatch(loginUser({ email, password }));
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
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
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
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                        <p
                                            style={{ color: "#4185f3", cursor: "pointer" }}
                                            onClick={() => {
                                                navigate("/handleForgotPassword");
                                            }}
                                        >
                                            Forgot Password?
                                        </p>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Logging in..." : "Login"}
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