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

function TotalUsers() {
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

    const todoChartData = todos.reduce((acc, todo) => {
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
                <Container fluid="lg" className="py-4">
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

                        <Offcanvas.Body className="p-0">
                            <Nav className="flex-column">
                                <Nav.Link
                                    className="py-3 px-4 border-bottom fw-semibold text-dark"
                                    onClick={() => {
                                        navigate("/admin");
                                        handleClose();
                                    }}
                                >
                                    📊 Admin Dashboard

                                </Nav.Link>

                                <Nav.Link
                                    className="py-3 px-4 border-bottom fw-semibold text-dark"
                                    onClick={() => {
                                        navigate("/userAnalytics");
                                        handleClose();
                                    }}
                                >
                                    📈 User Analytics
                                </Nav.Link>

                                <Nav.Link
                                    active
                                    className="py-3 px-4 border-bottom fw-semibold text-dark"
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
                            className="fw-semibold px-4"
                            onClick={() => navigate("/adminShowAll")}
                        >
                            View Todos
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="mt-4">
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
                                    {users.filter((user) => user.role === "admin").length}
                                </h1>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="dashboard-card bg-warning text-dark shadow">
                            <Card.Body className="text-center">
                                <h5 className="fw-semibold">
                                    <i className="bi bi-person-fill me-2"></i>
                                    Users
                                </h5>

                                <h1>
                                    {users.filter((user) => user.role === "user").length}
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