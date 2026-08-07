import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../fireBase/firebase";
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
import { Link } from "react-router-dom";
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
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchAllUsersTodos } from "../../todo/todoSlice";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchUsers } from "../../auth/authSlice";
import { toggleTheme, saveTheme } from "../../theme/themeSlice";
import "../../../assets/styles/Sidebar.css"

function TotalUsers() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { users, user, loadings } = useSelector((state) => state.auth);
    const { mode } = useSelector((state) => state.theme);

    const usersLoading = loadings.fetchUsers || false;


    const { allUsersTodos } = useSelector(
        (state) => state.todo
    );

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const chartData = [
        {
            name: "Admins",
            total: users.filter((user) => user.role === "admin").length,
        },
        {
            name: "Users",
            total: users.filter((user) => user.role === "user").length,
        },

    ];

    const todoChartData = allUsersTodos.reduce((acc, todo) => {
        const date = todo.date || "No Date";

        const existing = acc.find((item) => item.date === date);

        if (existing) {
            existing.total += 1;
        } else {
            acc.push({
                date,
                total: 1,
            });
        }

        return acc;
    }, []);

    useEffect(() => {
        dispatch(fetchAllUsersTodos());
    }, [dispatch]);

    const changeTheme = () => {
        const newTheme = mode === "light" ? "dark" : "light";

        dispatch(toggleTheme());

        if (user?.uid) {
            dispatch(saveTheme({ uid: user.uid, theme: newTheme }));
        }
    };

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

    const isDark = mode === "dark";

    return (
        <>
           <Navbar
        style={{
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          borderBottom: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
        }}
        variant={isDark ? "dark" : "light"}
        expand="lg"
        sticky="top"
        className="shadow"
      >
        <Container fluid="lg" className="py-3">
          <span
            style={{
              color: isDark ? "#f9fafb" : "#111827",
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
            style={{
              width: "280px",
              background: isDark ? "#111827" : "#f9fafb",
              color: isDark ? "#f9fafb" : "#111827",
            }}
          >
            <Offcanvas.Header
              closeButton
              style={{
                background: isDark ? "#111827" : "#f9fafb",
                color: isDark ? "#f9fafb" : "#111827",
                borderBottom: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
              }}
            >
              <Offcanvas.Title
                className="fw-bold"
                style={{ color: isDark ? "#f9fafb" : "#111827" }}
              >
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
                  active
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
                  className="btn w-100"
                  onClick={handleLogout}
                  style={{
                    background: "#dc3545",
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    borderRadius: "10px"
                  }}
                >
                  Logout
                </button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>

          <Navbar.Brand className="fw-bold fs-4">
            Admin Dashboard
          </Navbar.Brand>

          <Nav className="ms-auto align-items-center gap-2">
            <Button
              variant={isDark ? "outline-light" : "outline-dark"}
              onClick={() => navigate("/adminShowAll")}
            >
              View Todos
            </Button>

            <Button
              variant={isDark ? "outline-light" : "outline-dark"}
              onClick={changeTheme}
              className="rounded-pill"
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </Button>
          </Nav>
        </Container>
      </Navbar>

            <Container className="mt-4" style={{ background: isDark ? "#111827" : "#f8fafc", borderRadius: "20px", padding: "20px" }}>
                <Row className="mb-4">
                    <Col>
                        <h2 className="fw-bold">
                            User Statistics
                        </h2>

                        <p className="text-muted mb-0">
                            Overview of Admins and Users
                        </p>
                    </Col>
                </Row>

                <Row className="g-4 mb-4">
                    <Col md={6} lg={6}>
                        <Card className="dashboard-card bg-success text-white shadow">
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center py-4">
                                <Card.Title className="fw-semibold mb-3">
                                    <h5 className="fw-semibold mb-3">
                                        <i className="bi bi-people-fill me-2"></i>
                                        Total Users
                                    </h5>
                                </Card.Title>

                                <h1 className="display-4 fw-bold mb-0">
                                    {users.length}
                                </h1>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="g-4 mb-4">
                    <Col md={6} lg={6}>
                        <Card className="dashboard-card bg-success text-white shadow">
                            <Card.Body className="text-center">
                                <h5 className="fw-semibold">
                                    <i className="bi bi-person-badge-fill me-2"></i>
                                    Admins
                                </h5>

                                <h1>
                                    {users.filter((u) => u.role?.trim() === "admin").length}
                                </h1>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className={isDark ? "dashboard-card bg-secondary text-white shadow" : "dashboard-card bg-warning text-dark shadow"}>
                            <Card.Body className="text-center">
                                <h5 className="fw-semibold">
                                    <i className="bi bi-person-fill me-2"></i>
                                    Users
                                </h5>


                                <h1>
                                    {users.filter((u) => u.role?.trim() === "user").length}
                                </h1>




                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )

}
export default TotalUsers;