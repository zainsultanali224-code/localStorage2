import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../assets/styles/Login.css"
import SignInWithGoogle from "./signInWithGoogle";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, updateField, cleanForm } from "../authSlice";
import { toggleTheme, saveTheme } from "../../theme/themeSlice";

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const {
        loadings,
        errors,
        isAuthenticated,
        user,
        email,
        password,
    } = useSelector(state => state.auth);

    const { mode } = useSelector(state => state.theme);

    const authLoading = loadings.loginUser || false;
    const error = errors.loginUser;
    const isDark = mode === "dark";

    useEffect(() => {
        if (isAuthenticated && user) {
            toast.success("Login Successful!", {
                position: "top-center",
                autoClose: 1500,
            });

            dispatch(cleanForm());
            setTimeout(() => {
                if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/profile");
                }
            }, 500);
        }
    }, [isAuthenticated, user, navigate, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center",
            });
            dispatch(clearError("loginUser"))
        }
    }, [error, dispatch]);

    const changeTheme = () => {
        const newTheme = mode === "light" ? "dark" : "light";

        dispatch(toggleTheme());

        if (user?.uid) {
            dispatch(saveTheme({ uid: user.uid, theme: newTheme }));
        }
    };

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
        <div
            className="login-page"
            style={{
                background: isDark ? "#0f172a" : "#f8fafc",
                minHeight: "100vh",
                color: isDark ? "#f8fafc" : "#111827",
                transition: "all 0.3s ease",
            }}
        >
            <Container>
                <div className="d-flex justify-content-end pt-3">
                    <Button
                        variant={isDark ? "outline-light" : "outline-dark"}
                        size="sm"
                        className="rounded-pill"
                        onClick={changeTheme}
                    >
                        {isDark ? "☀️ Light" : "🌙 Dark"}
                    </Button>
                </div>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} sm={10} md={8} lg={5}>
                        <Card
                            className="login-card shadow-lg border-0"
                            style={{
                                background: isDark ? "#111827" : "#ffffff",
                                color: isDark ? "#f8fafc" : "#111827",
                            }}
                        >
                            <Card.Body className="p-5">
                                <form onSubmit={handleSubmit}>
                                    <h3 className="text-center mb-4 fw-bold" style={{ color: isDark ? "#f8fafc" : "#111827" }}>
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
                                            onChange={(e) => {
                                                dispatch(updateField({
                                                    name: "email",
                                                    value: e.target.value
                                                }))
                                            }}
                                            disabled={authLoading}
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
                                            onChange={(e) => {
                                                dispatch(updateField({
                                                    name: "password",
                                                    value: e.target.value
                                                }))
                                            }}
                                            disabled={authLoading}
                                            required
                                        />
                                        <p
                                            style={{ color: isDark ? "#60a5fa" : "#2563eb", cursor: "pointer" }}
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
                                            disabled={authLoading}
                                        >
                                            {authLoading ? "Logging in..." : "Login"}
                                        </button>
                                    </div>

                                    <p className="text-center mt-4 mb-3" style={{ color: isDark ? "#d1d5db" : "#374151" }}>
                                        New user?{" "}
                                        <Link
                                            to="/register"
                                            className="fw-semibold text-decoration-none"
                                            style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
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
        </div>
    );
}
export default Login;