import { useEffect, useState } from "react";
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
import { fetchAllUsersTodos } from "../../features/todo/todoSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.css"
import {
  logoutUser,
  fetchUsers
} from "../../features/auth/authSlice";
import { toggleTheme, saveTheme } from "../../features/theme/themeSlice";

function UserAnalytics() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, user, loadings } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const usersLoading = loadings.fetchUsers || false;


  const { allUsersTodos, isLoading } = useSelector(
    (state) => state.todo
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllUsersTodos());
  }, [dispatch]);

  const totalUsers = users.filter(
    (u) => u.role?.trim().toLowerCase() === "user"
  ).length;

  const totalAdmins = users.filter(
    (u) => u.role?.trim().toLowerCase() === "admin"
  ).length;

  const chartData = [
    {
      name: "Admins",
      total: totalAdmins,
    },
    {
      name: "Users",
      total: totalUsers,
    },
  ];

  const todoChartData = allUsersTodos.reduce((acc, todo) => {
    const date = todo.date || "No Date";

    const existing = acc.find(item => item.date === date);

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
                  active
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
        <Row className="g-4 mb-4">
          <Col>
            <h2 className="fw-bold">
              User Analytics
            </h2>

            <p className="text-muted mb-0">
              Analytics overview of users and todos
            </p>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={12}>
            <Card className="shadow-lg border-0 rounded-4 h-100" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#f9fafb" : "#111827" }}>
              <Card.Header className="border-0 py-3" style={{ background: isDark ? "#1f2937" : "#ffffff" }}>
                <h5 className="fw-bold mb-0">
                  📊 Users Analytics
                </h5>
              </Card.Header>

              <Card.Body style={{ height: "320px" }}>
                {usersLoading ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="total"
                        fill="#0d6efd"
                        radius={[12, 12, 0, 0]}
                        barSize={70}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={12}>
            <Card className="shadow-lg border-0 rounded-4" style={{ background: isDark ? "#1f2937" : "#ffffff", color: isDark ? "#f9fafb" : "#111827" }}>
              <Card.Header className="border-0 py-3" style={{ background: isDark ? "#1f2937" : "#ffffff" }}>
                <h5 className="fw-bold mb-0">
                  📈 Todos Analytics
                </h5>
              </Card.Header>

              <Card.Body style={{ height: "350px" }}>
                {usersLoading ? (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={todoChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#198754"
                        strokeWidth={4}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
export default UserAnalytics;