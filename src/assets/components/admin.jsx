import React, { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "./firebase";
import UsersTodos from "./adminShowAll";
import { useNavigate, } from "react-router-dom";


function Admin() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const docSnap = await getDocs(collection(db, "Users"))

                const userList = docSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setUsers(userList);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);


    return (
        <>
            <p
              style={{ color: "#4185f3", cursor: "pointer" }}
             onClick={() => {
                navigate("/adminShowAll");
            }}> todos</p>

            <div className="container mt-4">
                <h2>Users</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Admin;