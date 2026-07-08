import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("1. Register button clicked");
        console.log("2. Email:", email, "Password:", password, "Name:", fname);

        if (!fname || !email || !password) {
            toast.error("Please fill all required fields", {
                position: "bottom-center"
            });
            return;
        }

        setLoading(true);

        try {
            console.log("3. Creating user in Firebase Auth...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            console.log("4. User created successfully, UID:", uid);

            console.log("5. Saving user data to Firestore...");
            const userData = {
                email: email,
                firstName: fname,
                lastName: lname || "",
                createdAt: new Date()
            };

            await setDoc(doc(db, "User", uid), userData);

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

        } catch (error) {
            console.error(error);

            toast.error(error.message || "Registration failed", {
                position: "bottom-center"
            });

            setLoading(false);
        }
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
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            required
                                        />
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={loading}
                                        >
                                            {loading ? "Creating account..." : "Create Account"}
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