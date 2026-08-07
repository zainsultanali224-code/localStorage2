import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    ensureView, requestStarted, requestSucceeded, requestFailed, applySearch, setSearch, setPage as setPageAction,
    setViewMode as setViewModeAction,
    refetch as refetchAction,
    selectDataView,
} from "../../../auth/authSlice";
import { shallowEqual } from "react-redux";
import {
    Button,
    Card,
    Modal,
    Spinner,
    Table,
    Form as FForm,
    Row,
    Col,
} from "react-bootstrap";
import {
    openEdit as openEditView,
    closeEdit as closeEditView,
    openDetails,
    closeDetails,
    setFormValue,
} from "../../../auth/authSlice";

import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const DataContext = createContext();

export function useProviderContext() {
    return useContext(DataContext);
}

export default function DataProvider({
    thunk,
    params = {},
    component: Component,
    children,
    viewId,

    columns = [],
    title = "",
    emptyText = "No data found.",
    onUpdate,
    onDelete,
    showViewModes = true,

    initialPage = 1,
    limit = 10,
    debounceMs = 400,
}) {
    const dispatch = useDispatch();

    const id = viewId || thunk.typePrefix;

    const view = useSelector((state) =>
        selectDataView(state, id, initialPage, limit)
    );

    useEffect(() => {
        dispatch(
            ensureView({
                id,
                initialPage,
                limit,
            })
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(applySearch({ id }));
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [view.search]);

    useEffect(() => {
        if (!thunk) return;

        dispatch(requestStarted({ id }));


        dispatch(
            thunk({
                ...params,
                search: view.appliedSearch,
                page: view.page,
                limit,
            })
        )
            .unwrap()
            .then((result) => {

                if (Array.isArray(result)) {
                    dispatch(
                        requestSucceeded({
                            id,
                            data: result,
                            total: result.length,
                            extra: {},
                        })
                    );
                } else {
                    dispatch(
                        requestSucceeded({
                            id,
                            data: result.data || [],
                            total: result.total || 0,
                            extra: result.extra || {},
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    requestFailed({
                        id,
                        error: err.message,
                    })
                );
            });
    }, [view.page, view.appliedSearch, view.reloadId]);

    const refetch = () => {
        dispatch(refetchAction({ id }));
    };

    const changeViewMode = (mode) => {
        dispatch(
            setViewModeAction({
                id,
                mode,
            })
        );
    };

    const changePage = (page) => {
        dispatch(
            setPageAction({
                id,
                page,
            })
        );
    };

    const changeSearch = (value) => {
        dispatch(
            setSearch({
                id,
                value,
            })
        );
    };

    const contextValue = {
        data: view.data,
        total: view.total,
        loading: view.loading,
        error: view.error,
        search: view.search,

        pagination: {
            page: view.page,
            limit,
            totalPages: Math.max(1, Math.ceil(view.total / limit)),
        },

        viewMode: view.viewMode,

        viewId: id,

        columns,
        title,
        emptyText,
        onUpdate,
        onDelete,
        showViewModes,

        ...view.extra,

        setSearch: changeSearch,
        setPage: changePage,
        setViewMode: changeViewMode,
        refetch,
    };

    return (
        <DataContext.Provider value={contextValue}>
            {Component && <Component />}
            {children}
        </DataContext.Provider>
    );
}

export function DataTable() {
    const {
        data,
        total,
        search,
        setSearch,
        pagination,
        setPage,
        refetch,
        viewId,
        viewMode,
        setViewMode,
        showViewModes,
        title,
        columns,
        emptyText,
        onUpdate,
        onDelete,
    } = useProviderContext();

    const {
        loadings,
        errors
    } = useSelector((state) => state.auth);

    const loading = loadings["fetchEntity"];
    const error = errors["fetchEntity"];

    const isDark = useSelector(
        (state) => state.theme.mode === "dark"
    );

    const dispatch = useDispatch();

    const {
        selected,
        formValues,
        detailsItem,
    } = useSelector((state) =>
        selectDataView(state, viewId)
    );

    const editableColumns = (columns ?? []).filter(
        column => column.editable
    );

    const canEdit =
        onUpdate && editableColumns.length > 0;

    const canDelete = !!onDelete;

    const hasActions = canEdit || canDelete;

    function openEdit(item) {
        dispatch(
            openEditView({
                id: viewId,
                item,
                columns: editableColumns,
            })
        );
    }

    function closeEdit() {
        dispatch(
            closeEditView({
                id: viewId,
            })
        );
    }

    async function update() {
        const success = await onUpdate(selected, formValues);

        if (success) {
            refetch();
            closeEdit();
        }
    }

    async function remove(item) {
        const confirmDelete = window.confirm(
            "Delete this record?"
        );

        if (!confirmDelete) return;

        const success = await onDelete(item);

        if (!success) {
            toast.error("Delete failed");
            return;
        }

        toast.success("Deleted successfully");

        if (
            data.length === 1 &&
            pagination.page > 1
        ) {
            setPage(pagination.page - 1);
        } else {
            refetch();
        }
    }

    function closeDetailsModal() {
        dispatch(
            closeDetails({
                id: viewId,
            })
        );
    }


    function changeValue(key, value) {
        dispatch(
            setFormValue({
                id: viewId,
                key,
                value,
            })
        );
    }


    function renderInput(column) {
        switch (column.inputType) {
            case "select":
                return (
                    <FForm.Select
                        value={formValues[column.key] || ""}
                        onChange={(e) =>
                            changeValue(column.key, e.target.value)
                        }
                    >
                        {(column.options || []).map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </FForm.Select>
                );

            case "color":
                return (
                    <FForm.Control
                        type="color"
                        value={formValues[column.key] || "#000000"}
                        onChange={(e) =>
                            changeValue(column.key, e.target.value)
                        }
                    />
                );

            case "range":
                return (
                    <>
                        <div className="text-center mt-1 fw-bold">
                            {formValues[column.key]}
                        </div>
                        <FForm.Range
                            min={column.min ?? 0}
                            max={column.max ?? 100}
                            value={formValues[column.key] || 0}
                            onChange={(e) =>
                                changeValue(column.key, e.target.value)
                            }
                        />
                    </>
                );

            case "textarea":
                return (
                    <FForm.Control
                        as="textarea"
                        rows={3}
                        value={formValues[column.key] || ""}
                        onChange={(e) =>
                            changeValue(column.key, e.target.value)
                        }
                    />
                );

            default:
                return (
                    <FForm.Control
                        type={column.inputType || "text"}
                        value={formValues[column.key] || ""}
                        onChange={(e) =>
                            changeValue(column.key, e.target.value)
                        }
                    />
                );
        }
    }

    function renderCell(column, item) {

        if (column.render) {
            return column.render(item);
        }

        const value = item[column.key];

        if (column.type === "color") {
            return (
                <span
                    className="d-inline-block rounded-circle border"
                    style={{
                        width: 24,
                        height: 24,
                        backgroundColor: value,
                    }}
                />
            );
        }

        if (column.badge) {

            const badgeColor =
                value === "Completed" || value === "admin"
                    ? "bg-success"
                    : "bg-secondary";

            return (
                <span
                    className={`badge rounded-pill px-3 py-2 ${badgeColor}`}
                >
                    {value}
                </span>
            );
        }

        return value || "—";
    }

    return (
        <>
            <Card.Header
                className="border-0 py-3"
                style={{
                    background: isDark ? "#1f2937" : "#ffffff",
                }}
            >
                <Row className="align-items-center">

                    <Col md={showViewModes ? 5 : 7}>
                        <h5 className="fw-bold mb-0">
                            {title}
                        </h5>
                    </Col>

                    <Col md={showViewModes ? 4 : 5}>
                        <FForm.Control
                            type="text"
                            placeholder={`Search ${title}...`}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                    </Col>

                    {showViewModes && (
                        <Col md={3} className="text-end">

                            <Button
                                size="sm"
                                variant={
                                    viewMode === "list"
                                        ? "primary"
                                        : "outline-secondary"
                                }
                                onClick={() => setViewMode("list")}
                            >
                                List
                            </Button>

                            {" "}

                            <Button
                                size="sm"
                                variant={
                                    viewMode === "grid"
                                        ? "primary"
                                        : "outline-secondary"
                                }
                                onClick={() => setViewMode("grid")}
                            >
                                Grid
                            </Button>

                        </Col>
                    )}

                </Row>
            </Card.Header>

            <Card.Body>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        {viewMode === "list" && (

                            <div
                                className="table-responsive rounded-4 border"
                                style={{
                                    borderColor: "#e2e8f0",
                                    boxShadow: "0 4px 18px rgba(15,23,42,.07)",
                                }}
                            >

                                <Table
                                    hover
                                    bordered
                                    className="align-middle text-center mb-0"
                                    variant={isDark ? "dark" : undefined}
                                    style={{
                                        minWidth: 900,
                                        color: isDark ? "#f8fafc" : "#1e293b",
                                    }}
                                >

                                    <thead
                                        style={{
                                            background: isDark ? "#0f172a" : "#f1f5f9",
                                        }}
                                    >
                                        <tr>

                                            <th>#</th>

                                            {columns.map((column) => (
                                                <th key={column.key}>
                                                    {column.label}
                                                </th>
                                            ))}

                                            {hasActions && (
                                                <th>Actions</th>
                                            )}

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {data.length > 0 ? (

                                            data.map((item, index) => (

                                                <tr key={item.id || index}>

                                                    <td>
                                                        {(pagination.page - 1) *
                                                            pagination.limit +
                                                            index +
                                                            1}
                                                    </td>

                                                    {columns.map((column) => (

                                                        <td key={column.key}>
                                                            {renderCell(column, item)}
                                                        </td>

                                                    ))}

                                                    {hasActions && (

                                                        <td>

                                                            {canEdit && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-primary"
                                                                    onClick={() =>
                                                                        openEdit(item)
                                                                    }
                                                                >
                                                                    <FaEdit />
                                                                </Button>
                                                            )}

                                                            {" "}

                                                            {canDelete && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-danger"
                                                                    onClick={() =>
                                                                        remove(item)
                                                                    }
                                                                >
                                                                    <FaTrashAlt />
                                                                </Button>
                                                            )}

                                                        </td>

                                                    )}

                                                </tr>

                                            ))

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan={
                                                        columns.length +
                                                        1 +
                                                        Number(hasActions)
                                                    }
                                                    className="py-4 text-muted"
                                                >
                                                    {emptyText}
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </Table>

                            </div>

                        )}

                        {viewMode === "grid" && (

                            <Row className="g-4">

                                {data.map((item, index) => (

                                    <Col
                                        sm={6}
                                        lg={4}
                                        key={item.id || index}
                                    >

                                        <Card
                                            className="h-100 shadow-sm"
                                            style={{
                                                borderRadius: "16px",
                                            }}
                                        >

                                            <Card.Body>

                                                {columns.map((column) => (
                                                    <div key={column.key} className="mb-2">
                                                        <strong>{column.label}:</strong>{" "}
                                                        {renderCell(column, item)}
                                                    </div>
                                                ))}

                                            </Card.Body>

                                        </Card>

                                    </Col>

                                ))}

                            </Row>
                        )}

                        {data.length > 0 &&
                            total > pagination.limit && (

                                <div className="text-center mt-4">

                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        disabled={pagination.page === 1}
                                        onClick={() =>
                                            setPage(pagination.page - 1)
                                        }
                                    >
                                        Previous
                                    </Button>

                                    {" "}

                                    <span className="mx-3">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        disabled={
                                            pagination.page === pagination.totalPages
                                        }
                                        onClick={() =>
                                            setPage(pagination.page + 1)
                                        }
                                    >
                                        Next
                                    </Button>

                                </div>

                            )}
                    </>
                )}

            </Card.Body>

            <Modal
                show={Boolean(selected)}
                onHide={closeEdit}
                centered
                dialogClassName="modal-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit Todo
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Row>

                        {editableColumns.map((column) => (

                            <Col
                                key={column.key}
                                md={column.inputType === "textarea" ? 12 : 6}
                            >

                                <FForm.Group className="mb-3">

                                    <FForm.Label>
                                        {column.label}
                                    </FForm.Label>

                                    {renderInput(column)}

                                </FForm.Group>

                            </Col>

                        ))}

                    </Row>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={closeEdit}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={update}
                    >
                        Save
                    </Button>

                </Modal.Footer>

            </Modal>


            <Modal
                show={Boolean(detailsItem)}
                onHide={closeDetailsModal}
                centered
                dialogClassName="modal-lg"
            >

                <Modal.Header closeButton>
                    <Modal.Title>
                        Todo Details
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {detailsItem && (

                        <Row>

                            {columns.map((column) => (

                                <Col
                                    key={column.key}
                                    md={column.key === "desc" ? 12 : 6}
                                    className="mb-3"
                                >

                                    <Card>

                                        <Card.Body>

                                            <h6 className="text-muted">
                                                {column.label}
                                            </h6>

                                            <div>
                                                {renderCell(column, detailsItem)}
                                            </div>

                                        </Card.Body>

                                    </Card>

                                </Col>

                            ))}

                        </Row>

                    )}

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={closeDetailsModal}
                    >
                        Close
                    </Button>

                </Modal.Footer>

            </Modal>
        </>
    );
}