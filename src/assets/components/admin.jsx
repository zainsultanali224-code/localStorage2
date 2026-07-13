import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";

import "./Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const docSnap = await getDocs(collection(db, "Users"));

        const userList = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
      {/* Navbar */}

      <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
        <Container>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>

          <Nav className="ms-auto">
            <Button
              variant="outline-light"
              onClick={() => navigate("/adminShowAll")}
            >
              View Todos
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">

        {/* Cards */}

        <Row className="mb-4">

          <Col md={4}>
            <Card className="dashboard-card bg-primary text-white shadow">
              <Card.Body>
                <h5>Total Users</h5>
                <h2>{users.length}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card bg-success text-white shadow">
              <Card.Body>
                <h5>Admins</h5>
                <h2>
                  {users.filter((user) => user.role === "admin").length}
                </h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card bg-warning text-dark shadow">
              <Card.Body>
                <h5>Users</h5>
                <h2>
                  {users.filter((user) => user.role === "user").length}
                </h2>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* Users Table */}

        <Card className="shadow border-0">

          <Card.Header className="table-header">
            <h4 className="mb-0">Registered Users</h4>
          </Card.Header>

          <Card.Body>

            <Table striped hover responsive className="align-middle">

              <thead className="table-dark">
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
                    <td>
                      <span
                        className={
                          user.role === "admin"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {user.role}
                      </span>
                    </td>
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

export default Admin;