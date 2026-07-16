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
  Spinner,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Offcanvas from 'react-bootstrap/Offcanvas';
import "./Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const docSnap = await getDocs(collection(db, "Users"));
        const userList = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);

        const allTodos = [];
        for (const user of docSnap.docs) {
          const todoSnap = await getDocs(
            collection(db, "Users", user.id, "Todos")
          );
          const todoList = todoSnap.docs.map((todo) => ({
            id: todo.id,
            ...todo.data(),
          }));
          allTodos.push(...todoList);
        }

        setTodos(allTodos);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="shadow"
      >
        <Container fluid="lg" className="py-3">
          <span style={{ color: "white", fontSize: "30px", cursor: "pointer" }} onClick={handleShow}>
            &#9776;
          </span>

          <Offcanvas
            show={show}
            onHide={handleClose}
            style={{ width: "280px" }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="fw-bold">
                Dashboard Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>

              <Nav className="flex-column">
                <Nav.Link
                  active
                  className="py-3 px-4 border-bottom fw-semibold"
                  onClick={() => {
                    navigate("/admin");
                    handleClose();
                  }}
                >
                  📊 Admin Dashboard
                </Nav.Link>

                <Nav.Link
                  className="py-3 px-4 border-bottom fw-semibold"
                  onClick={() => {
                    navigate("/userAnalytics");
                    handleClose();
                  }}
                >
                  📈 User Analytics
                </Nav.Link>

                <Nav.Link
                  className="py-3 px-4 fw-semibold"
                  onClick={() => {
                    navigate("/totalUsers");
                    handleClose();
                  }}
                >
                  👥 Total Users
                </Nav.Link>

                <Nav.Link
                  active
                  className="py-3 px-4 fw-semibold"
                  onClick={() => {
                    navigate("/adminShowAll");
                    handleClose();
                  }}
                >
                  📝 View Todos
                </Nav.Link>

              </Nav>
            </Offcanvas.Body>
          </Offcanvas>

          <Navbar.Brand className="fw-bold fs-4">
            Admin Dashboard
          </Navbar.Brand>

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
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-white border-0 py-3">
            <h5 className="fw-bold mb-0">
              👥 Registered Users
            </h5>

          </Card.Header>

          <Card.Body>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold">
                  Registered Users
                </h2>

                <p className="text-muted mb-0">
                  View all registered users and their roles
                </p>
              </Col>
            </Row>

            <Table
              hover
              responsive
              bordered
              className="align-middle text-center mb-0"
            >
              <thead className="table-light">
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
                    <td className="fw-semibold">
                      {index + 1}
                    </td>

                    <td className="fw-semibold">
                      {user.firstName}
                    </td>

                    <td className="fw-semibold">
                      {user.lastName}
                    </td>

                    <td className="text-primary">
                      {user.email}
                    </td>

                    <td>
                      <span
                        className={
                          user.role === "admin"
                            ? "badge rounded-pill bg-success px-3 py-2"
                            : "badge rounded-pill bg-secondary px-3 py-2"
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