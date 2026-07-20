import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearError,
  updateField,
  cleanForm,
} from "../../features/auth/authSlice";

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authLoading, error, isAuthenticated } = useSelector(state => state.auth);
    const { email, password, fname, lname} = useSelector(state => state.auth)

    console.log({ email, password, fname, lname });

    const authState = useSelector((state) => state.auth);

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
            dispatch(cleanForm());
            
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
                                            onChange={(e) =>{
                                                 dispatch(updateField({name: "fname", 
                                                value: e.target.value
                                            }))}}
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
                                                
                                                dispatch(updateField({name: "lname",
                                                value: e.target.value
                                            }))}}
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
                                                dispatch(updateField({name: "email",
                                                value: e.target.value
                                            }))}}
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
                                            onChange={(e) => { dispatch(updateField({name: "password", 
                                                value: e.target.value
                                            }))}}
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