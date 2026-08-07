import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AdminLayout } from "../users/components/AdminUsersUI"
import Provider ,{ DataTable } from "../users/components/AdminTodosProvider";
import { fetchEntity } from "../../auth/authSlice";

function Admin() {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === "dark";

  return (
    <AdminLayout title="Admin Dashboard">
      <Card
        className="shadow-lg border-0 rounded-4"
        style={{
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
        }}
      >
       
        <Provider
          params={{ key: "users" }}
          thunk={fetchEntity}
          limit={10}
          component={DataTable}
          title="Registered Users"
          columns={[
            { key: "firstName", label: "First Name" },
            { key: "lastName", label: "Last Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role", badge: true },
          ]}
        />
      </Card>
    </AdminLayout>
  );
}

export default Admin;
