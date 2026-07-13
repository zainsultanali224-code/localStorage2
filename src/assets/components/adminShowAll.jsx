import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {
  Container,
  Navbar,
  Card,
  Table,
  Badge,
  Placeholder,
} from "react-bootstrap";

import "./UsersTodos.css";

function UsersTodos() {
  const [userTodos, setUserTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        setLoading(true);

        const users = await getDocs(collection(db, "Users"));

        const allTodos = [];

        for (const user of users.docs) {
          const todos = await getDocs(
            collection(db, "Users", user.id, "Todos")
          );

          const todosList = todos.docs.map((doc) => ({
            id: doc.id,
            userId: user.id,
            userEmail: user.data().email,
            ...doc.data(),
          }));

          allTodos.push(...todosList);
        }

        setUserTodos(allTodos);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTodos();
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="shadow">
        <Container>
          <Navbar.Brand>All Users Todos</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {/* Summary Card */}
        <Card className="shadow border-0 mb-4">
          <Card.Body className="text-center">
            <h5>Total Todos</h5>

            {loading ? (
              <Placeholder animation="glow">
                <Placeholder xs={2} />
              </Placeholder>
            ) : (
              <h2 className="text-primary">{userTodos.length}</h2>
            )}
          </Card.Body>
        </Card>

        {/* Table */}
        <Card className="shadow border-0">
          <Card.Header className="table-title">
            <h4 className="mb-0">Users Todo List</h4>
          </Card.Header>

          <Card.Body>
            <Table responsive hover striped className="align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Color</th>
                  <th>Range</th>
                  <th>Description</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Country</th>
                </tr>
              </thead>

              <tbody>
                {loading
                  ? [...Array(8)].map((_, row) => (
                      <tr key={row}>
                        {[...Array(11)].map((_, col) => (
                          <td key={col}>
                            <Placeholder animation="glow">
                              <Placeholder xs={12} />
                            </Placeholder>
                          </td>
                        ))}
                      </tr>
                    ))
                  : userTodos.map((todo, index) => (
                      <tr key={todo.id}>
                        <td>{index + 1}</td>

                        <td>{todo.userEmail}</td>

                        <td>{todo.title}</td>

                        <td>{todo.location}</td>

                        <td>{todo.date}</td>

                        <td>
                          <div
                            className="color-box"
                            style={{
                              backgroundColor: todo.col,
                            }}
                          ></div>
                        </td>

                        <td>{todo.rang}</td>

                        <td>{todo.desc}</td>

                        <td>{todo.gender}</td>

                        <td>
                          <Badge
                            bg={
                              todo.status === "Completed"
                                ? "success"
                                : "warning"
                            }
                          >
                            {todo.status}
                          </Badge>
                        </td>

                        <td>{todo.count}</td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default UsersTodos;