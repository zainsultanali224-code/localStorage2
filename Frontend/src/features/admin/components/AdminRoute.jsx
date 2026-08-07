import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { user, authLoading, isAuthenticated } = useSelector(state => state.auth);

  if (authLoading) {
    return <div>Loading...</div>;
}

  if (isAuthenticated && user?.role === "admin") {
    return children;
  }

  return <Navigate to="/login" replace />;
}

export default AdminRoute;