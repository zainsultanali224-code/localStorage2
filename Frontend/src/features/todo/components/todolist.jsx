import { Link, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "../../fireBase/firebase";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Navbar,
    Nav,
    Badge,
    Form as FForm
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../fireBase/firebase";
import getPaginationUsersTodos from "../../hooks/pagination";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, fetchUserTodos, fetchSingleTodo, updateTodo } from "../todoSlice";
import { fetchPaginationTodos, deleteTodo } from "../todoSlice";
import account from "../../../assets/images/account.png"
import { Modal } from "react-bootstrap";
import ProfileDetail from "../../admin/Profile/PfDetail";
import { useRef } from "react";
import "../../../assets/styles/todoNav.css"
import "../../../assets/styles/todolist.css"

export function Search({ userId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedTodo, setSelectedTodo] = useState(null);

    const [showProfile, setShowProfile] = useState(false);
    const handleClose = () => setShowProfile(false);
    const handleShow = () => setShowProfile(true);

    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCursors, setPageCursors] = useState({
        1: null,
    });
    const [lastVisible, setLastVisible] = useState(null);
    const nextRequestRef = useRef(false);
    const [deletingId, setDeletingId] = useState(null);

    const {
        tasks,
        loadings,
        hasNextPage,
        totalItems,
    } = useSelector((state) => state.todo);

    const isLoading = loadings["fetchPaginationTodos"];

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const fetchTasks = async (search = "", cursor = null) => {
        if (!userId) return;

        const result = await dispatch(
            fetchPaginationTodos({
                userId,
                pageSize: 5,
                searchValue: search,
                lastVisible: cursor,
            })
        );

        if (fetchPaginationTodos.fulfilled.match(result)) {
            setLastVisible(result.payload.lastVisible);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, [userId]);

    const pageSize = 5;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearchValue(value);
        setCurrentPage(1);
        setLastVisible(null);

        setPageCursors({
            1: null,
        });

        fetchTasks(value, null);
    };


    const handleNext = async () => {
        if (nextRequestRef.current || isLoading || !hasNextPage) return;

        nextRequestRef.current = true;

        try {
            const currentCursor = lastVisible;

            const result = await dispatch(
                fetchPaginationTodos({
                    userId,
                    pageSize: 5,
                    searchValue,
                    lastVisible: currentCursor,
                })
            );

            if (fetchPaginationTodos.fulfilled.match(result)) {

                const nextPage = currentPage + 1;

                setPageCursors(prev => ({
                    ...prev,
                    [nextPage]: currentCursor,
                }));

                setCurrentPage(nextPage);
                setLastVisible(result.payload.lastVisible);
            }

        } finally {
            nextRequestRef.current = false;
        }
    };

    const handlePrevious = async () => {
        if (currentPage === 1) return;

        const previousPage = currentPage - 1;

        const cursor = pageCursors[previousPage] || null;

        const result = await dispatch(
            fetchPaginationTodos({
                userId,
                pageSize: 5,
                searchValue,
                lastVisible: cursor,
            })
        );

        if (fetchPaginationTodos.fulfilled.match(result)) {
            setCurrentPage(previousPage);
            setLastVisible(result.payload.lastVisible);
        }
    };

    const handleDelete = async (todoId) => {
         console.log("Delete clicked");
    console.log("userId:", userId);
    console.log("todoId:", todoId);

    setDeletingId(todoId);

    try {
        const result = await dispatch(
            deleteTodo({
                userId,
                todoId,
            })
        );

            if (!deleteTodo.fulfilled.match(result)) return;

            const cursor = pageCursors[currentPage] || null;

            const response = await dispatch(
                fetchPaginationTodos({
                    userId,
                    pageSize: 5,
                    searchValue,
                    lastVisible: cursor,
                })
            );

            if (fetchPaginationTodos.fulfilled.match(response)) {
                if (
                    response.payload.data.length === 0 &&
                    currentPage > 1
                ) {
                    const previousPage = currentPage - 1;

                    setCurrentPage(previousPage);

                    dispatch(
                        fetchPaginationTodos({
                            userId,
                            pageSize: 5,
                            searchValue,
                            lastVisible: pageCursors[previousPage] || null,
                        })
                    );
                } else {
                    setLastVisible(response.payload.lastVisible);
                }
            }
        } finally {
            setDeletingId(null);
        }
    };
    useEffect(() => {
        const pages = Math.max(1, Math.ceil(totalItems / pageSize));

        if (currentPage > pages) {
            setCurrentPage(pages);
        }
    }, [totalItems, currentPage]);

    return (
        <>
            <Navbar
                expand="lg"
                className="custom-navbar shadow-sm py-3"
                sticky="top"
            >
                <Container>
                    <Navbar.Brand className="brand-logo fw-bold">
                        <span className="text-primary">TODO</span> APP
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse
                        id="basic-navbar-nav"
                        className="justify-content-end"
                    >
                        <div className="d-flex align-items-center gap-3">

                            <span className="welcome-text">
                                Welcome,
                                <span className="fw-semibold ms-1">
                                    {user?.firstName || "User"}
                                </span>
                            </span>

                            <img
                                src={
                                    user?.image ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt="Profile"
                                className="profile-img"
                                onClick={() => setShowProfile(true)}
                            />
                        </div>
                    </Navbar.Collapse>
                </Container>

                <Modal
                    show={showProfile}
                    onHide={() => setShowProfile(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ProfileDetail />
                    </Modal.Body>
                </Modal>
            </Navbar>
            <Container style={{
                backgroundColor: "#f4f7fb"
            }}>
                <Container>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold">Task Manager</h1>
                        <p className="text-muted">
                            {tasks.length > 0 ? `Showing ${tasks.length} tasks` : "No tasks found"}
                        </p>
                    </div>


                    <Row className="align-items-center mb-4">
                        <Col md={9}>
                            <FForm.Control
                                placeholder="🔍 Search Task..."
                                className="search-box"
                                size="lg"
                                type="text"
                                placeholder="Search Task..."
                                value={searchValue}
                                onChange={handleSearch}
                            />
                        </Col>

                        <Col md={3} className="text-end">
                            <Link to="/add-task">
                                <Button className="add-btn" size="lg" variant="outline-primary">
                                    + Add Task
                                </Button>
                            </Link>
                        </Col>
                    </Row>

                    <Row >
                        {isLoading ? (
                            <Col>
                                <Card className="shadow border-0 text-center p-5">
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-3 text-muted">Loading tasks...</p>
                                    </div>
                                </Card>
                            </Col>
                        ) : tasks.length > 0 ? (
                            tasks.map((selectedTask) => (
                                <Col
                                    md={6}
                                    lg={4}
                                    className="mb-4"
                                    key={selectedTask.id}
                                >
                                    <Card
                                        className="shadow border-0 h-100"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        <Card.Header
                                            className="d-flex justify-content-between align-items-center text-white"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg,#0d6efd,#6610f2)",
                                            }}
                                        >
                                            <strong>{selectedTask.title}</strong>
                                        </Card.Header>


                                        {/* <Card.Body> */}
                                        <Card.Body className="task-body">
                                            <p>
                                                <strong>Location:</strong> {selectedTask.location}
                                            </p>
                                            <p>
                                                <strong>Date:</strong> {selectedTask.date}
                                            </p>
                                            <p>
                                                <strong>Description:</strong>
                                                <br />
                                                {selectedTask.desc}
                                            </p>
                                            <p>
                                                <strong>Range:</strong>
                                                {/* <Badge bg="info" className="ms-2">
                                                    {selectedTask.rang}
                                                </Badge> */}
                                                <Badge bg="info" className="task-badge ms-2">
                                                    {selectedTask.rang}
                                                </Badge>
                                            </p>
                                            <p>
                                                <strong>Color:</strong>{" "}
                                                {/* <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: "35px",
                                                        height: "20px",
                                                        borderRadius: "2px",
                                                        backgroundColor: selectedTask.col,
                                                        marginLeft: "8px",
                                                        marginTop: "6px",
                                                    }}
                                                /> */}
                                                <span
                                                    className="color-box"
                                                    style={{ backgroundColor: selectedTask.col }}
                                                ></span>
                                            </p>
                                            <p>
                                                <strong>Country:</strong> {selectedTask.count}
                                            </p>
                                            <p>
                                                <strong>Number:</strong> {selectedTask.num}
                                            </p>
                                            <p>
                                                <strong>Status:</strong> {selectedTask.status}
                                            </p>
                                            <p>
                                                <strong>Gender:</strong> {selectedTask.gender}
                                            </p>
                                            <p>
                                                <strong>Marital Status:</strong> {selectedTask.merital}
                                            </p>
                                            {selectedTask.merital === "Married" && (
                                                <p>
                                                    <strong>Children:</strong> {selectedTask.Children}
                                                </p>
                                            )}
                                        </Card.Body>



                                        <Card.Footer className="bg-white border-0">
                                            <div className="d-flex justify-content-between">
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleDelete(selectedTask.id)}
                                                    disabled={deletingId === selectedTask.id}
                                                >
                                                    {deletingId === selectedTask.id ? "Deleting..." : "Delete"}
                                                </Button>

                                                <Button
                                                    variant="outline-success"
                                                    onClick={() =>
                                                        navigate(`/edit-Task/${selectedTask.id}`)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </Card.Footer>
                                    </Card>

                                    <Modal
                                        show={selectedTodo !== null}
                                        onHide={() => setSelectedTodo(null)}
                                        centered
                                    >

                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                {selectedTodo?.title}
                                            </Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body>

                                            <p><strong>Country:</strong> {selectedTodo?.count}</p>

                                            <p><strong>Phone:</strong> {selectedTodo?.num}</p>

                                            <p><strong>Gender:</strong> {selectedTodo?.gender}</p>

                                            <p><strong>Marital:</strong> {selectedTodo?.merital}</p>

                                            {selectedTodo?.merital === "Married" && (
                                                <p>
                                                    <strong>Children:</strong> {selectedTodo?.Children}
                                                </p>
                                            )}

                                        </Modal.Body>

                                    </Modal>
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <Card
                                    className="shadow border-0 text-center p-5"
                                    style={{ minHeight: "50vh" }}
                                >
                                    <h3 style={{ marginTop: "74px" }}>
                                        {searchValue ? "No Tasks Found" : "No Tasks Yet"}
                                    </h3>
                                </Card>
                            </Col>
                        )}
                    </Row>

                    {tasks.length > 0 && (
                        <div className="pagination-box text-center">
                            <Button
                                variant="secondary"
                                onClick={handlePrevious}
                                disabled={currentPage === 1 || isLoading}
                                className="px-4"
                            >
                                ← Previous
                            </Button>

                            <span className="mx-4 fw-bold fs-5">
                                {currentPage} / {totalPages}
                            </span>

                            <Button
                                variant="primary"
                                onClick={handleNext}
                                disabled={!hasNextPage || isLoading}
                                className="px-4"
                            >
                                Next →
                            </Button>
                        </div>
                    )}
                </Container>
            </Container>
        </>
    );
}
