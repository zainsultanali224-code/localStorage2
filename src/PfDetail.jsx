import { logoutUser, cleanForm, updateProfile } from "./features/auth/authSlice";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";


function ProfileDetail() {
    const dispatch = useDispatch();
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    const [showProfile, setShowProfile] = useState(false);
    const handleClose = () => setShowProfile(false);
    const handleShow = () => setShowProfile(true);

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
        }
    }, [user]);

    const handleSave = () => {
        dispatch(
            updateProfile({
                firstName,
                lastName,
                image: imageFile,
            }));
    };

    return (
        <>
            <div className="container mt-5">
                <div className="card p-4">
                    <div className="text-center">
                        <img
                            src={
                                user?.image ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt=""
                            width="150"
                            height="150"
                            className="rounded-circle"
                        />

                        <input
                            type="file"
                            className="form-control mt-3"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />

                    </div>

                    <div className="mt-4">
                        <label>First Name</label>

                        <input
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <label className="mt-3">Last Name</label>

                        <input
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <label className="mt-3">Email</label>

                        <input
                            className="form-control"
                           value={user?.email || ""}
                            disabled
                        />

                        <button
                            className="btn btn-success mt-4"
                            onClick={handleSave}
                        >

                            Save Changes

                        </button>

                    </div>

                </div>

            </div>
        </>
    )
}
export default ProfileDetail;