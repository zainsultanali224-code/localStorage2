import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Table, Spinner, Button, Container, Navbar, Nav, Badge, Modal, Form as FForm } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useProviderContext } from "./AdminTodosProvider";
import { logoutUser } from "../../../features/auth/authSlice";
import { toggleTheme, saveTheme } from "../../../features/theme/themeSlice";
import "../Admin.css";
import "../Sidebar.css";

const DEFAULT_MENU = [
  { label: "📊 Admin Dashboard", path: "/admin" },
  { label: "📈 User Analytics", path: "/userAnalytics" },
  { label: "👥 Total Users", path: "/totalUsers" },
  { label: "📝 View Todos", path: "/adminShowAll" },
];


export function AdminLayout({ title = "Admin Dashboard", menu = DEFAULT_MENU, children }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mode } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.auth.user);
  const isDark = mode === "dark";

  const changeTheme = () => {
    const newTheme = mode === "light" ? "dark" : "light";

    dispatch(toggleTheme());

    if (user?.uid) {
      dispatch(
        saveTheme({
          uid: user.uid,
          theme: newTheme,
        })
      );
    }
  };

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar
        style={{
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          borderBottom: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
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
                {menu.map((item) => (
                  <Nav.Link
                    key={item.path}
                    className="sidebar-link"
                    active={item.path === window.location.pathname}
                    onClick={() => {
                      navigate(item.path);
                      handleClose();
                    }}
                  >
                    {item.label}
                  </Nav.Link>
                ))}
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
                    borderRadius: "10px",
                  }}
                >
                  Logout
                </button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>

          <Navbar.Brand className="fw-bold fs-4">{title}</Navbar.Brand>

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

      <Container
        className="mt-4"
        style={{
          background: isDark ? "#111827" : "#f8fafc",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        {children}
      </Container>
    </>
  );
}

export default function EntityUI() {
  const {
    data = [],
    search,
    setSearch,
    pagination = { page: 1, limit: 10, totalPages: 1 },
    setPage,
    refetch,
    title = "Data",
    columns = [],
    editable = false,
    onUpdate,
    onDelete,
  } = useProviderContext();

  const {
    loadings,
    errors
  } = useSelector((state) => state.auth);

  const loading = loadings["fetchEntity"];
  const error = errors["fetchEntity"];

  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === "dark";

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editValues, setEditValues] = useState({});

  const editableColumns = columns.filter((c) => c.editable);

  const openEdit = (item) => {
    const initial = {};
    editableColumns.forEach((col) => {
      initial[col.key] = item[col.key] ?? "";
    });
    setSelectedItem(item);
    setEditValues(initial);
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedItem || !onUpdate) return;

    const ok = await onUpdate(selectedItem, editValues);

    if (ok) {
      toast.success("Updated successfully");
      setShowEditModal(false);
      refetch();
    } else {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (item) => {
    if (!onDelete) return;
    if (!window.confirm("Delete this record?")) return;

    const ok = await onDelete(item);

    if (ok) {
      toast.success("Deleted successfully");
      refetch();
    } else {
      toast.error("Delete failed");
    }
  };

  const renderCell = (col, item) => {
    if (col.render) return col.render(item);

    if (col.badge) {
      const value = item[col.key];
      const isPositive = value === "Completed" || value === "admin";
      return (
        <span className={isPositive ? "badge rounded-pill bg-success px-3 py-2" : "badge rounded-pill bg-secondary px-3 py-2"}>
          {value}
        </span>
      );
    }

    if (col.type === "color") {
      return (
        <div
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: item[col.key],
            borderRadius: "50%",
            margin: "auto",
            border: "1px solid #ccc",
          }}
        />
      );
    }

    return item[col.key];
  };

  return (
    <>
      <Card.Header
        className="border-0 py-3"
        style={{ background: isDark ? "#1f2937" : "#ffffff" }}
      >
        <Row className="align-items-center">
          <Col md={8}>
            <h5 className="fw-bold mb-0">{title}</h5>
          </Col>
          <Col md={4}>
            <FForm.Control
              type="text"
              placeholder={`Search ${title}...`}
              value={search}
              onChange={(e) => {
                console.log(e.target.value);
                setSearch(e.target.value)
              }}
              style={{
                background: isDark ? "#374151" : "#fff",
                color: isDark ? "#f9fafb" : "#111827",
                border: isDark ? "1px solid #4b5563" : "1px solid #d9dee5",
              }}
            />
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        {error && <p className="text-danger">Error: {String(error)}</p>}

        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Table
              hover
              responsive
              bordered
              className="align-middle text-center mb-0"
              style={{ color: isDark ? "#f9fafb" : "#111827" }}
            >
              <thead className={isDark ? "table-dark" : "table-light"}>
                <tr>
                  <th>#</th>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  {editable && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (editable ? 2 : 1)} className="text-muted py-4">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      {columns.map((col) => (
                        <td key={col.key}>{renderCell(col, item)}</td>
                      ))}
                      {editable && (
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              size="sm"
                              className="rounded-pill px-3 shadow-sm"
                              style={{ background: "#212529", border: "none" }}
                              onClick={() => openEdit(item)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="rounded-pill px-3 shadow-sm"
                              onClick={() => handleDelete(item)}
                            >
                              <FaTrashAlt />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="align-self-center text-muted">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {editable && (
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered backdrop="static">
            <Modal.Header
              closeButton
              style={{
                background: isDark ? "#111827" : "#212529",
                color: "#fff",
                borderBottom: isDark ? "1px solid #374151" : "1px solid #343a40",
              }}
            >
              <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{
                background: isDark ? "#1f2937" : "#f8f9fa",
                color: isDark ? "#f9fafb" : "#111827",
              }}
            >
              {editableColumns.map((col) => (
                <FForm.Group className="mb-3" key={col.key}>
                  <FForm.Label className="fw-semibold">
                    {col.label}
                    {col.inputType === "range" && (
                      <span className="ms-2 text-primary">
                        {formValues[col.key]}
                      </span>
                    )}
                  </FForm.Label>

                  {col.inputType === "select" ? (
                    <FForm.Select
                      value={formValues[col.key] || ""}
                      onChange={(e) =>
                        changeValue(col.key, e.target.value)
                      }
                    >
                      {(col.options || []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </FForm.Select>
                  ) : col.inputType === "color" ? (
                    <FForm.Control
                      type="color"
                      value={formValues[col.key] || "#000000"}
                      onChange={(e) =>
                        changeValue(col.key, e.target.value)
                      }
                    />
                  ) : col.inputType === "range" ? (
                    <>
                      <FForm.Range
                        min={col.min ?? 0}
                        max={col.max ?? 100}
                        value={formValues[col.key] || 0}
                        onChange={(e) =>
                          changeValue(col.key, e.target.value)
                        }
                      />

                      <div className="d-flex justify-content-between small text-muted">
                        <span>{col.min ?? 0}</span>
                        <span>{col.max ?? 100}</span>
                      </div>
                    </>
                  ) : col.inputType === "textarea" ? (
                    <FForm.Control
                      as="textarea"
                      rows={3}
                      value={formValues[col.key] || ""}
                      onChange={(e) =>
                        changeValue(col.key, e.target.value)
                      }
                    />
                  ) : (
                    <FForm.Control
                      type={col.inputType || "text"}
                      value={formValues[col.key] || ""}
                      onChange={(e) =>
                        changeValue(col.key, e.target.value)
                      }
                    />
                  )}
                </FForm.Group>
              ))}
            </Modal.Body>
            <Modal.Footer
              style={{
                background: isDark ? "#111827" : "#fff",
                borderTop: isDark ? "1px solid #374151" : "1px solid #dee2e6",
              }}
            >
              <Button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "#6c757d",
                  border: "none",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 20px"
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                style={{
                  background: "#212529",
                  border: "none",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 20px"
                }}
              >
                <FaEdit className="me-2" />
                Update
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Card.Body>
    </>
  );
}
