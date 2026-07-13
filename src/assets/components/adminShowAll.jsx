import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

function UsersTodos() {
    const [userTodos, setUserTodos] = useState([]);

    useEffect(() => {
        console.log("UsersTodos component mounted, fetching todos...");

        const fetchUserTodos = async () => {

            try {

                const users = await getDocs(collection(db, "Users"));
                
                const   allTodos = [];

                for (const user of users.docs) {
                    const todos = await getDocs(collection(db, "Users", user.id, "Todos"));

                    const todosList = todos.docs.map((doc) => ({
                        id: doc.id,
                        userId: user.id,
                        userEmail: user.data().email,
                        ...doc.data(),
                    }));

                    console.log(`Fetched todos for user ${user.id}:`, todosList);

                    allTodos.push(...todosList);

                    console.log(`User todos state updated for user ${user.id}:`, todosList);
                }

                setUserTodos(allTodos);
            } catch (error) {
                console.error("Error fetching user todos:", error);
            }
        };

        fetchUserTodos();
    }, []);


    return (
        <>
            <div>
                <h2>User Todos</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Title</th>
                            <th>Location</th>
                            <th>date</th>
                            <th>Color</th>
                            <th>Range</th>
                            <th>Description</th>
                            <th>Gender</th>
                            <th>Status</th>
                            <th>Country</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTodos.map((todo, index) => (
                            <tr key={todo.id}>
                                <td>{index + 1}</td>
                                <td>{todo.userEmail}</td>
                                <td>{todo.title}</td>
                                <td>{todo.location}</td>
                                <td>{todo.date}</td>
                                <td><div
                                    style={{
                                        width: "25px",
                                        height: "25px",
                                        backgroundColor: todo.col,
                                        border: "1px solid #000",
                                        margin: "auto",
                                    }}
                                ></div></td>
                                <td>{todo.rang}</td>
                                <td>{todo.desc}</td>
                                <td>{todo.gender}</td>
                                <td>{todo.status}</td>
                                <td>{todo.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default UsersTodos;