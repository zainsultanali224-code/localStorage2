import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import {
    registerUser,
    clearError,
    updateField,
    cleanForm,
} from "../../features/auth/authSlice";
import { toggleTheme, saveTheme } from "../../features/theme/themeSlice";

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        loadings,
        errors,
        param,
        isAuthenticated,
        user,
        email,
        password,
        authState,
        fname, lname 
    } = useSelector(state => state.auth);

    const { mode } = useSelector(state => state.theme);

    const authLoading = loadings.registerUser || false;
    const error = errors.registerUser;
    const isDark = mode === "dark";


    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center"
            });
            dispatch(clearError("registerUser"))
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Registration Successful!", {
                position: "top-center"
            });
            dispatch(cleanForm());

            setTimeout(() => {
                navigate("/profile");
            }, 1000);
        }
    }, [isAuthenticated, navigate]);

    const changeTheme = () => {
        const newTheme = mode === "light" ? "dark" : "light";

        dispatch(toggleTheme());

        if (user?.uid) {
            dispatch(saveTheme({ uid: user.uid, theme: newTheme }));
        }
    };

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
        <div
            className="register-page"
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
                            className="register-card shadow-lg border-0"
                            style={{
                                background: isDark ? "#111827" : "#ffffff",
                                color: isDark ? "#f8fafc" : "#111827",
                            }}
                        >
                            <Card.Body className="p-5">
                                <form onSubmit={handleRegister}>
                                    <h3 className="text-center fw-bold mb-4" style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                                        Create Account
                                    </h3>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            value={fname}
                                            onChange={(e) => {
                                                dispatch(updateField({
                                                    name: "fname",
                                                    value: e.target.value
                                                }))
                                            }}
                                            disabled={authLoading}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name"
                                            value={lname}
                                            onChange={(e) => {

                                                dispatch(updateField({
                                                    name: "lname",
                                                    value: e.target.value
                                                }))
                                            }}
                                            disabled={authLoading}
                                        />
                                    </div>

                                    <div className="mb-3">
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
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={authLoading}
                                        >
                                            {authLoading ? "Creating account..." : "Create Account"}
                                        </button>
                                    </div>

                                    <p className="text-center mt-4 mb-0" style={{ color: isDark ? "#d1d5db" : "#374151" }}>
                                        Already have an account?{" "}

                                        <a
                                            href="/login"
                                            className="text-decoration-none fw-semibold"
                                            style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
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