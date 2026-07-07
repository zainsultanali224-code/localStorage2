import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Register button clicked"); // ✅ Test ke liye
        
        // Validation
        if (!fname || !email || !password) {
            toast.error("Please fill all fields", { position: "bottom-center" });
            return;
        }

        try {
            console.log("Creating user...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User created, UID:", userCredential.user.uid);

            console.log("Saving to Firestore...");
            await setDoc(doc(db, "Users", userCredential.user.uid), {
                email: userCredential.user.email,
                firstName: fname,
                lastName: lname
            });
            console.log("Data saved successfully!");

            toast.success("User Registered Successfully!!", {
                position: "top-center"
            });

            // Clear fields
            setEmail("");
            setPassword("");
            setFname("");
            setLname("");

            // Redirect
            setTimeout(() => {
                window.location.href = "/profile";
            }, 1000);

        } catch (error) {
            console.error("Error:", error.message);
            toast.error(error.message, {
                position: "bottom-center"
            });
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
                    value={fname}  // ✅ value add kiya
                    onChange={(e) => setFname(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={lname}  // ✅ value add kiya
                    onChange={(e) => setLname(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={email}  // ✅ value add kiya
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}  // ✅ value add kiya
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>
            <p className="forgot-password text-right">
                Already have an account? <a href="/login">Login Here</a>
            </p>
        </form>
    )
}

export default Register;
