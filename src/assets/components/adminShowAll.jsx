import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function UsersTodos() {
    const [userTodos, setUserTodos] = useState([]);

    useEffect(() => {
        const fetchUserTodos = async () => {
            try {
                const docSnap = await getDocs(collection(db, "Todos"));

                const todosList = docSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUserTodos(todosList);
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
                            <td>{todo.description}</td>
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