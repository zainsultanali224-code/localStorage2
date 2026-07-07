import { Form } from "formik";
import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import SignInwithGoogle from "./signInWIthGoogle";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    return (
        <form>
            <h3>Login</h3>

            <div className="mb-3">
                <label>Email Address</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>
            <p className="forgot-password text-right">
                New user <a href="/register">Register Here</a>
            </p>
            <SignInwithGoogle />
        </form>
    )
}

export default Login;