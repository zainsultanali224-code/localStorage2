import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Navbar,
  Nav,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./UsersTodos.css";
import Offcanvas from 'react-bootstrap/Offcanvas';

function UsersTodos() {
  const [userTodos, setUserTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

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
                  className="py-3 px-4 border-bottom fw-semibold"
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

      <Container fluid="lg" className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">
              All Users Todos
            </h2>

            <p className="text-muted mb-0">
              View and manage all todos created by registered users
            </p>

          </Col>

        </Row>

        <Card className="shadow-lg border-0 rounded-4 mb-4">
          <Card.Body className="text-center py-4">

            <h5 className="fw-semibold">
              📝 Total Todos
            </h5>

            <h1 className="display-4 fw-bold text-primary">
              {userTodos.length}
            </h1>

          </Card.Body>
        </Card>

        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-white border-0 py-3">

            <h5 className="fw-bold mb-0">
              🗂 Users Todo List
            </h5>
          </Card.Header>

          <Card.Body>
            <Table
              responsive
              hover
              bordered
              className="align-middle text-center mb-0"
            >
              <thead className="table-light">
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
                      <td className="fw-semibold">
                        {index + 1}
                      </td>

                      <td className="text-primary fw-semibold">
                        {todo.userEmail}
                      </td>

                      <td>{todo.title}</td>

                      <td>{todo.location}</td>

                      <td>{todo.date}</td>

                      <td>
                        <div

                          style={{
                            width: "28px",
                            height: "28px",
                            backgroundColor: todo.col,
                            borderRadius: "50%",
                            margin: "auto",
                            border: "1px solid #ccc"
                          }}

                        ></div>
                      </td>

                      <td>{todo.rang}</td>

                      <td style={{ maxWidth: "250px" }}>

                        <div className="text-truncate">

                          {todo.desc}

                        </div>

                      </td>

                      <td>{todo.gender}</td>

                      <td>
                        <Badge
                          pill
                          bg={
                            todo.status === "Completed"
                              ?
                              "success"
                              :
                              "warning"
                          }
                        >
                          {todo.status}
                        </Badge>
                      </td>

                      <td className="fw-semibold">
                        {todo.count}
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

export default UsersTodos;