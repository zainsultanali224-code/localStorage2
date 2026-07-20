import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Button,
    Form as FForm
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewTodo } from "./features/todo/todoSlice";
import { toast } from "react-toastify";

const SignupSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, "Too Short!")
        .max(25, "Too Long!")
        .required("Please Enter Your Title."),
    location: Yup.string()
        .required("Please enter a location."),
    date: Yup.string()
        .required("Please select a date."),
    desc: Yup.string()
        .max(600, "Description cannot exceed 600 characters."),
    col: Yup.string()
        .required("Color is required."),
    rang: Yup.string()
        .required("Range is required."),
    count: Yup.string()
        .required("Please select a country."),
    num: Yup.number()
        .typeError("Must be a number.")
        .required("Number is required."),
    status: Yup.string()
        .required("Please select a status."),
    gender: Yup.string()
        .required("Please select a gender"),
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

export default function SignupForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { user } = useSelector(state => state.auth);
    const { isLoading, error } = useSelector(state => state.todo);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center"
            });
        }
    }, [error]);

    async function handleSubmit(values) {
        if (!user?.uid) {
            console.error("User not authenticated");
            return;
        }

        const todoData = {
            title: values.title,
            location: values.location,
            date: values.date,
            desc: values.desc,
            rang: values.rang,
            col: values.col,
            count: values.count,
            num: values.num,
            status: values.status,
            gender: values.gender,
            merital: values.merital,
            Children: values.Children,
        };

        const resultAction = await dispatch(addNewTodo({ 
            userId: user.uid, 
            todoData 
        }));

        if (addNewTodo.fulfilled.match(resultAction)) {
            toast.success("Task added successfully!", {
                position: "top-center"
            });
            navigate("/profile");
        }
    }

    return (
        <Formik
            initialValues={{
                title: "",
                location: "",
                date: "",
                desc: "",
                rang: "50",
                col: "#000000",
                count: "Pakistan",
                num: "0",
                status: "Pending",
                gender: "",
                merital: "",
                Children: "0"
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => (<Container fluid className="bg-light min-vh-100 py-5">
                <Container>
                    <Card
                        className="shadow-lg border-0 mx-auto"
                        style={{
                            maxWidth: "900px",
                            borderRadius: "20px",
                        }}
                    >
                        <Card.Header
                            className="text-center text-white py-4"
                            style={{
                                background:
                                    "linear-gradient(135deg,#0d6efd,#6610f2)",
                            }}
                        > 
                            <h2 className="mb-0">Add Task</h2>
                        </Card.Header>

                        <Card.Body className="p-4">
                            <Form>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <FForm.Label>Title</FForm.Label>
                                        <FForm.Control
                                            name="title"
                                            placeholder="Enter Title"
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
                                            placeholder="Enter Location"
                                            value={formik.values.location}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
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
                                            onBlur={formik.handleBlur}
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
                                            placeholder="Enter Number"
                                            value={formik.values.num}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
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
                                            placeholder="Enter Description"
                                            value={formik.values.desc}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
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
                                            min={1}
                                            max={100}
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
                                        <FForm.Label>Choose Color</FForm.Label>
                                        <div className="d-flex align-items-center gap-3">
                                            <FForm.Control
                                                type="color"
                                                name="col"
                                                value={formik.values.col}
                                                onChange={formik.handleChange}
                                                style={{
                                                    width: "80px",
                                                    height: "50px",
                                                }}
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="col"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </Col>

                                    <Col md={6}>
                                        <FForm.Label>Status:</FForm.Label>
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
                                        <FForm.Label>Gender:</FForm.Label>
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

                                    <Col md={12}>
                                        <FForm.Label>Marital Status</FForm.Label>
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
                                        <FForm.Label>Country</FForm.Label>
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

                                    <Col md={12} className="text-center mt-4">
                                        <Button 
                                            type="submit"
                                            variant="outline-primary"
                                            size="lg"
                                            className="px-5"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Adding..." : "Add Task"}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </Container>
            )}
        </Formik>
    );
}