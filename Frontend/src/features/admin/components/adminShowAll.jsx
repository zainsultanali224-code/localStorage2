import { Row, Col, Card } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AdminLayout } from "../users/components/AdminUsersUI";
import Provider ,{ DataTable, useProviderContext } from "../users/components/AdminTodosProvider";
import { fetchEntity } from "../../auth/authSlice";
import { deleteTodoByAdmin, updateTodoByAdmin } from "../../todo/todoSlice";

function TodosStats() {
  const { total = 0, completedCount = 0, pendingCount = 0 } = useProviderContext();

  return (
    <Row className="g-4 mb-4">
      <Col md={4}>
        <Card
          className="border-0 rounded-4"
          style={{ background: "#fff", boxShadow: "0 8px 25px rgba(0,0,0,.08)" }}
        >
          <Card.Body>
            <h6 className="text-muted">Total Todos</h6>
            <h2 className="fw-bold text-primary">{total}</h2>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card
          className="border-0 rounded-4"
          style={{ background: "#fff", boxShadow: "0 8px 25px rgba(0,0,0,.08)" }}
        >
          <Card.Body>
            <h6 className="text-muted">Completed</h6>
            <h2 className="fw-bold text-success">{completedCount}</h2>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card
          className="border-0 rounded-4"
          style={{ background: "#fff", boxShadow: "0 8px 25px rgba(0,0,0,.08)" }}
        >
          <Card.Body>
            <h6 className="text-muted">Pending</h6>
            <h2 className="fw-bold text-warning">{pendingCount}</h2>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

function UsersTodos() {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === "dark";
  const dispatch = useDispatch();

  const updateTodo = async (item, updatedTodo) => {
    const action = await dispatch(updateTodoByAdmin({
      userId: item.userId,
      todoId: item.id,
      updatedTodo,
    }));
    return updateTodoByAdmin.fulfilled.match(action);
  };

  const deleteTodo = async (item) => {
    const action = await dispatch(deleteTodoByAdmin({ userId: item.userId, todoId: item.id }));
    return deleteTodoByAdmin.fulfilled.match(action);
  };

  return (
    <AdminLayout title="Admin Dashboard">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold mb-1">Users Todo Management</h2>
          <p className="text-secondary mb-0">
            View, Edit and Delete all user todos.
          </p>
        </Col>
      </Row>

      <Provider
        params={{ key: "usersTodos" }}
        thunk={fetchEntity}
        limit={10}
        title="Users Todo List"
        showViewModes
        columns={[
          { key: "userEmail", label: "Email" },
          { key: "title", label: "Title", editable: true },
          { key: "location", label: "Location", editable: true },
          { key: "date", label: "Date" },
          { key: "col", label: "Color", type: "color", editable: true, inputType: "color" },
          { key: "rang", label: "Range", editable: true, inputType: "range", min: 0, max: 100 },
          { key: "desc", label: "Description", editable: true, inputType: "textarea" },
          { key: "gender", label: "Gender" },
          { key: "status", label: "Status", badge: true, editable: true, inputType: "select", options: ["Pending", "Completed"] },
          { key: "count", label: "Country" },
        ]}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      >
        <TodosStats />

        <Card
          className="border-0 rounded-4 overflow-hidden"
          style={{
            background: isDark ? "#1f2937" : "#fff",
            color: isDark ? "#f9fafb" : "#111827",
            boxShadow: "0 10px 35px rgba(0,0,0,.08)",
          }}
        >
          <DataTable />
        </Card>
      </Provider>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </AdminLayout>
  );
}

export default UsersTodos;
