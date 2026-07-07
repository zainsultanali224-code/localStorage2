import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await  createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user)
            console.log("User Registered Successfully!!")
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <h3>Sign Up</h3>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    onChange={(e) => setFname(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                onChange={(e) => setLname(e.target.value)}
                />

            </div>

            <div className="mb-3">
                <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="mb-3">
            <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </div>

             <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>

        </form>
    )
}

export default Register;