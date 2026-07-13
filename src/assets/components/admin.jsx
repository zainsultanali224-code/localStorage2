import React, { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "./firebase";


function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    try {
        const fetchUsers = async () => {
        const docSnap = await getDocs(collection(db, "Users"))

        const userList = docSnap.docs.map((doc) => ({
            id: doc.id,
             ...doc.data()
               }));

    }
    setUsers(userList);
    } catch (error) {
        console.log(error.message);
    }

    fetchUsers();
  }, []);
  

    return (
        <div  className="container mt-4">
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
        </div>
    );
}

export default Admin;