import { Link, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "./assets/components/firebase";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Form as FForm
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./assets/components/firebase";
import getPaginationUsersTodos from "./assets/components/pagination";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserId, fetchUserTodos, fetchSingleTodo, updateTodo } from "./features/todo/todoSlice";
import {
    fetchPaginationTodos,
    deleteTodo,
} from "./features/todo/todoSlice";


export default function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const {
        userId,
        selectedTask,
        isLoading,
        updateError,
    } = useSelector((state) => state.todo);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                dispatch(setUserId(user.uid));
            } else {
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchSingleTodo({ userId, todoId: id }));
        }
    }, [dispatch, userId, id]);

    const SignupSchema = Yup.object().shape({
        title: Yup.string().required("Required"),
        location: Yup.string().required("Required"),
        date: Yup.string().required("Required"),
        desc: Yup.string().max(600),
        col: Yup.string().required("Required"),
        rang: Yup.string().required("Required"),
        count: Yup.string().required("Required"),
        num: Yup.number().required("Required"),
        status: Yup.string().required("Required"),
        merital: Yup.string()
            .oneOf(["Single", "Married"]),
        Children: Yup
            .number()
            .when("merital", {
                is: 'Married',
                then: (schema) => schema
                    .required("Please enter the number of children.")
                    .min(0, "Number of children cannot be negative."),
                otherwise: (schema) => schema.optional().nullable()
            })
    });

    const handleUpdate = async (values) => {
        const result = await dispatch(
            updateTodo({
                userId,
                todoId: id,
                updatedData: values,
            })
        );

        if (updateTodo.fulfilled.match(result)) {
            navigate("/profile");
        }
    };
    if (!userId || !selectedTask) {
        return <p>Loading...</p>;
    }

    return (<Container fluid className="bg-light min-vh-100 py-5"> <Container>
        <Card
            className="shadow-lg border-0 mx-auto"
            style={{ maxWidth: "900px", borderRadius: "20px" }}
        >
            <Card.Header
                className="text-center text-white py-4"
                style={{
                    background:
                        "linear-gradient(135deg,#198754,#20c997)",
                }}
            > <h2 className="mb-0">Edit Task</h2>
            </Card.Header>

            <Card.Body className="p-4">
                <Formik
                    initialValues={{
                        title: selectedTask?.title || "",
                        location: selectedTask?.location || "",
                        date: selectedTask?.date || "",
                        desc: selectedTask?.desc || "",
                        rang: selectedTask?.rang || "",
                        col: selectedTask?.col || "#000000",
                        count: selectedTask?.count || "Pakistan",
                        num: selectedTask?.num || "",
                        status: selectedTask?.status || "Pending",
                        gender: selectedTask?.gender || "",
                        merital: selectedTask?.merital || "",
                        Children: selectedTask?.Children || 0,
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={handleUpdate}
                    enableReinitialize
                >
                    {(formik) => (
                        <Form>
                            <Row className="g-4">
                                <Col md={6}>
                                    <FForm.Label>Title</FForm.Label>
                                    <FForm.Control
                                        name="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={6}>
                                    <FForm.Label>Location</FForm.Label>
                                    <FForm.Control
                                        name="location"
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage
                                        name="location"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={6}>
                                    <FForm.Label>Date</FForm.Label>
                                    <FForm.Control
                                        type="date"
                                        name="date"
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage
                                        name="date"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={6}>
                                    <FForm.Label>Number</FForm.Label>
                                    <FForm.Control
                                        type="number"
                                        name="num"
                                        value={formik.values.num}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage
                                        name="num"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={12}>
                                    <FForm.Label>Description</FForm.Label>
                                    <FForm.Control
                                        as="textarea"
                                        rows={4}
                                        name="desc"
                                        value={formik.values.desc}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage
                                        name="desc"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={6}>
                                    <FForm.Label>Range: {formik.values.rang}</FForm.Label>
                                    <FForm.Range
                                        name="rang"
                                        value={formik.values.rang}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage
                                        name="rang"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={6}>
                                    <FForm.Label>Color</FForm.Label>
                                    <FForm.Control
                                        type="color"
                                        name="col"
                                        value={formik.values.col}
                                        onChange={formik.handleChange}
                                    />
                                    <ErrorMessage
                                        name="col"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={6}>
                                    <FForm.Label>
                                        Status:
                                    </FForm.Label>

                                    <Col>
                                        <div className="mb-3">
                                            <FForm.Check
                                                inline
                                                label="Pending"
                                                name="status"
                                                value="Pending"
                                                checked={formik.values.status === "Pending"}
                                                onChange={formik.handleChange}
                                                type="radio"
                                            />

                                            <FForm.Check
                                                inline
                                                label="Completed"
                                                name="status"
                                                value="Completed"
                                                checked={formik.values.status === "Completed"}
                                                onChange={formik.handleChange}
                                                type="radio"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="status"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </Col>
                                </Col>

                                <Col md={6}>
                                    <FForm.Label>
                                        Gender:
                                    </FForm.Label>
                                    <Col>
                                        <div className="mb-3">
                                            <FForm.Check
                                                inline
                                                label="Male"
                                                name="gender"
                                                value="Male"
                                                checked={formik.values.gender === "Male"}
                                                onChange={formik.handleChange}
                                                type="radio"
                                            />

                                            <FForm.Check
                                                inline
                                                label="Female"
                                                name="gender"
                                                value="Female"
                                                checked={formik.values.gender === "Female"}
                                                onChange={formik.handleChange}
                                                type="radio"
                                            />

                                            <FForm.Check
                                                inline
                                                label="Others"
                                                name="gender"
                                                value="Others"
                                                checked={formik.values.gender === "Others"}
                                                onChange={formik.handleChange}
                                                type="radio"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="gender"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </Col>
                                </Col>

                                <Col>
                                    <FForm.Label>
                                    </FForm.Label>
                                    <Col>
                                        <div className="mb-3">
                                            <FForm.Check
                                                inline
                                                label="Single"
                                                name="merital"
                                                value="Single"
                                                checked={formik.values.merital === "Single"}
                                                onChange={formik.handleChange}
                                                type="radio"
                                            />

                                            <FForm.Check
                                                inline
                                                label="Married"
                                                name="merital"
                                                value="Married"
                                                checked={formik.values.merital === "Married"}
                                                onChange={formik.handleChange}
                                                type="radio"
                                            />

                                            {formik.values.merital === "Married" && (
                                                <FForm.Group>
                                                    <FForm.Label>Number of Children</FForm.Label>
                                                    <FForm.Control
                                                        type="number"
                                                        name="Children"
                                                        value={formik.values.Children}
                                                        onChange={formik.handleChange}
                                                    />
                                                </FForm.Group>
                                            )}
                                        </div>
                                        <ErrorMessage
                                            name="Children"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </Col>
                                </Col>
                                <Col md={12}>
                                    <FForm.Select
                                        name="count"
                                        value={formik.values.count}
                                        onChange={formik.handleChange}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                    </FForm.Select>

                                    <ErrorMessage
                                        name="count"
                                        component="div"
                                        className="text-danger"
                                    />
                                </Col>

                                <Col md={12} className="text-center">
                                    <Button
                                        type="submit"
                                        variant="outline-success"
                                        className="px-5 mt-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Updating Task..." : "Update Task"}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    </Container>
    </Container>
    );
}

export function Search({ userId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [previousCursors, setPreviousCursors] = useState([]);
    const [nextLoading, setNextLoading] = useState(false);

    const {
        tasks,
        isLoading,
        lastVisible,
        hasNextPage,
        totalItems,
    } = useSelector((state) => state.todo);

    const fetchTasks = (search = "", cursor = null) => {
        if (!userId) return;

        dispatch(
            fetchPaginationTodos({
                userId,
                pageSize: 5,
                searchValue: search,
                lastVisible: cursor,
            })
        );
    };
    useEffect(() => {
        fetchTasks();
    }, [userId]);

    const pageSize = 5;
    const totalPages = Math.ceil(totalItems / pageSize);

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearchValue(value);
        setCurrentPage(1);
        setPreviousCursors([]);

        fetchTasks(value, null);
    };

    const handleNext = async () => {
        if (!hasNextPage || nextLoading || currentPage >= totalPages)
            return;

        setNextLoading(true);

        try {
            setPreviousCursors((prev) => [...prev, lastVisible]);

            await dispatch(
                fetchPaginationTodos({
                    userId,
                    pageSize: 5,
                    searchValue,
                    lastVisible,
                })
            );

            setCurrentPage((prev) => prev + 1);
        } finally {
            setNextLoading(false);
        }
    };

    const handlePrevious = () => {
        if (previousCursors.length === 0) return;

        const history = [...previousCursors];
        history.pop();

        const previousCursor =
            history.length === 0
                ? null
                : history[history.length - 1];

        setPreviousCursors(history);
        setCurrentPage((prev) => prev - 1);

        fetchTasks(searchValue, previousCursor);
    };

    const handleDelete = async (id) => {
        await dispatch(
            deleteTodo({
                userId,
                todoId: id,
            })
        );

        fetchTasks(searchValue, null);
    };

    return (
        <Container fluid className="bg-light min-vh-100 py-5">
            <Container>
                <div className="text-center mb-5">
                    <h1 className="fw-bold">Task Manager</h1>
                    <p className="text-muted">
                        {tasks.length > 0 ? `Showing ${tasks.length} tasks` : "No tasks found"}
                    </p>
                </div>

                <Row className="mb-4">
                    <Col md={8}>
                        <FForm.Control
                            size="lg"
                            type="text"
                            placeholder="Search Task..."
                            value={searchValue}
                            onChange={handleSearch}
                        />
                    </Col>

                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                        <Link to="/add-task">
                            <Button size="lg" variant="outline-primary">
                                Add New Task
                            </Button>
                        </Link>
                    </Col>
                </Row>

                <Row>
                    {isLoading ? (
                        <Col>
                            <Card
                                className="shadow border-0 text-center p-5"
                                style={{ minHeight: "50vh" }}
                            >
                                <h3 style={{ marginTop: "74px" }}>
                                    Loading tasks...
                                </h3>
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

                                    <Card.Body>
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
                                            <Badge bg="info" className="ms-2">
                                                {selectedTask.rang}
                                            </Badge>
                                        </p>
                                        <p>
                                            <strong>Color:</strong>{" "}
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: "35px",
                                                    height: "20px",
                                                    borderRadius: "2px",
                                                    backgroundColor: selectedTask.col,
                                                    marginLeft: "8px",
                                                    marginTop: "6px",
                                                }}
                                            />
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
                                            >
                                                Delete
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
                    <div className="text-center mt-4">
                        <Button
                            variant="outline-secondary"
                            onClick={handlePrevious}
                            disabled={previousCursors.length === 0}
                            className="me-3"
                        >
                            ← Previous
                        </Button>
                        <span className="mx-3 fw-semibold">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline-primary"
                            onClick={handleNext}
                            disabled={!hasNextPage || nextLoading || currentPage >= totalPages}
                        >
                            {nextLoading ? "Loading..." : "Next →"}
                        </Button>
                    </div>
                )}
            </Container>
        </Container>
    );
}
