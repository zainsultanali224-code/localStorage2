import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function UsersTodos() {
    const [userTodos, setUserTodos] = useState([]);

    useEffect(() => {
        console.log("UsersTodos component mounted, fetching todos...");
        const fetchUserTodos = async () => {
            try {
                console.log("Fetching user todos from Firestore...");
                const docSnap = await getDocs(collection(db, "Users", "Todos"));

                const todosList = docSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("Fetched user todos:", todosList);
                setUserTodos(todosList);
                console.log("User todos state updated:", todosList);
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
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {userTodos.map((todo, index) => (
                        <tr key={todo.id}>
                            <td>{index + 1}</td>
                            <td>{todo.title}</td>
                            <td>{todo.desc}</td>
                            <td>{todo.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>
       </>
    );
}

export default UsersTodos;