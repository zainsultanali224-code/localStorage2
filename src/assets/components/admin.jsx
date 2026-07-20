import React, { useEffect, useState, useRef } from "react";
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
import { logoutUser } from "../../features/auth/authSlice";
import { fetchAllUsersTodos } from "../../features/todo/todoSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.css"
import { fetchUsers } from "../../features/auth/authSlice";
import { toggleTheme, saveTheme } from "../../features/theme/themeSlice";


function Admin() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const { allUsersTodos, error } = useSelector((state) => state.todo)
  const { users, usersLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);


  console.log("Admin Render");
  const { mode } = useSelector((state) => state.theme);

  const changeTheme = () => {

    let newTheme =
      mode === "light"
        ? "dark"
        : "light";

    dispatch(toggleTheme());

    dispatch(
      saveTheme({
        uid: user.uid,
        theme: newTheme,
      })
    );
  }

  useEffect(() => {
    console.log("Admin Mounted");

    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchUsers());
    }

    return () => {
      console.log("Admin Unmounted");
    };
  }, [dispatch]);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      navigate("/login");
    }
  };

  if (usersLoading) {
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
        <button onClick={changeTheme}>

          {
            mode === "light"
              ? "🌙 Dark"
              : "☀️ Light"
          }

        </button>


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

            <Offcanvas.Body className="d-flex flex-column sidebar-body">

              <Nav className="flex-column">

                <Nav.Link
                  active
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
                    <td>{index + 1}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={
                          user.role.trim() === "admin"
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