import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ Add karo
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // ✅ Add karo

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
            console.log("6. User data to save:", userData);

            await setDoc(doc(db, "Users", uid), userData);
            console.log("7. Data saved to Firestore successfully!");

            toast.success("Registration Successful!", {
                position: "top-center"
            });

            // Clear form
            setEmail("");
            setPassword("");
            setFname("");
            setLname("");

            // ✅ window.location.href ki jagay navigate use karo
            console.log("8. Redirecting to profile...");
            setTimeout(() => {
                navigate("/profile");  // Soft navigation, console persist rahega
            }, 1500);

        } catch (error) {
            console.error("ERROR:", error);
            console.error("Error message:", error.message);
            console.error("Error code:", error.code);
            
            toast.error(error.message || "Registration failed", {
                position: "bottom-center"
            });
            setLoading(false);
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

            <div className="mb-3">
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating account..." : "Submit"}
                </button>
            </div>

            <p className="forgot-password text-right">
                Already have an account? <a href="/login">Login Here</a>
            </p>
        </form>
    )
}

export default Register;