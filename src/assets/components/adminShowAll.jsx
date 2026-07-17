import React, { useEffect, useState } from "react";
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
import { Form as FForm } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UsersTodos.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersTodos } from "../../features/todo/todoSlice";
import { logoutUser } from "../../features/auth/authSlice";
import "./Sidebar.css";

function UsersTodos() {
  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allUsersTodos = [], isLoading } = useSelector(
    (state) => state.todo
  );

  useEffect(() => {
    dispatch(fetchAllUsersTodos());
  }, [dispatch]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      navigate("/login");
    }
  };

  const filteredTodos = allUsersTodos.filter((todo) => {
    const search = searchValue.toLowerCase();
    return (
      todo.title?.toLowerCase().includes(search) ||
      todo.userEmail?.toLowerCase().includes(search) || 
      todo.count?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
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
          <span
            style={{
              color: "white",
              fontSize: "30px",
              cursor: "pointer",
            }}
            onClick={handleShow}
          >
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

            <Offcanvas.Body className="d-flex flex-column sidebar-body">
              <Nav className="flex-column">
                <Nav.Link
                  className="sidebar-link"
                  onClick={() => {
                    navigate("/admin");
                    handleClose();
                  }}
                >
                  📊 Admin Dashboard
                </Nav.Link>

                <Nav.Link
                  className="sidebar-link"
                  onClick={() => {
                    navigate("/userAnalytics");
                    handleClose();
                  }}
                >
                  📈 User Analytics
                </Nav.Link>

                <Nav.Link
                  className="sidebar-link"
                  onClick={() => {
                    navigate("/totalUsers");
                    handleClose();
                  }}
                >
                  👥 Total Users
                </Nav.Link>

                <Nav.Link
                  active
                  className="sidebar-link"
                  onClick={() => {
                    navigate("/adminShowAll");
                    handleClose();
                  }}
                >
                  📝 View Todos
                </Nav.Link>
              </Nav>

              <div className="mt-auto pt-3 border-top">
                <button
                  className="btn btn-danger w-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
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
            <h2 className="fw-bold">All Users Todos</h2>

            <p className="text-muted mb-0">
              View and manage all todos created by registered users
            </p>
          </Col>
        </Row>

        <Card className="shadow-lg border-0 rounded-4 mb-4">
          <Card.Body className="text-center py-4">
            <h5 className="fw-semibold">📝 Total Todos</h5>

            <h1 className="display-4 fw-bold text-primary">
              {filteredTodos.length}
            </h1>
          </Card.Body>
        </Card>

        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-white border-0 py-3">
            <h5 className="fw-bold mb-3">🗂 Users Todo List</h5>

            <Col md={8}>
              <FForm.Control
                size="lg"
                type="text"
                placeholder="Search Task..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Col>
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
                {filteredTodos.length > 0 ? (
                  filteredTodos.map((todo, index) => (
                    <tr key={todo.id}>
                      <td>{index + 1}</td>

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
                            border: "1px solid #ccc",
                          }}
                        />
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
                              ? "success"
                              : "warning"
                          }
                        >
                          {todo.status}
                        </Badge>
                      </td>

                      <td>{todo.count}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      No Todos Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default UsersTodos;