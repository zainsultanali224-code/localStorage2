import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTodos } from "../../todo/todoSlice";
import { Search } from "../../todo/components/todolist";
import { loginUser, cleanForm, logoutUser } from "../../auth/authSlice";
import { toggleTheme, saveTheme } from "../../theme/themeSlice";
import { Button } from "react-bootstrap";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const { mode } = useSelector((state) => state.theme);

  const { isLoading: todosLoading } = useSelector(state => state.todo);
  const isDark = mode === "dark";

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      dispatch(fetchUserTodos(user.uid));
    }
  }, [isAuthenticated, user?.uid, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
      dispatch(cleanForm());
      navigate("/login");
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div
        className="text-center p-5"
        style={{
          background: isDark ? "#0f172a" : "#f8fafc",
          minHeight: "100vh",
          color: isDark ? "#f8fafc" : "#111827",
        }}
      >
        <p>User data not found.</p>
        <Button variant={isDark ? "outline-light" : "outline-dark"} onClick={handleLogout}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: isDark ? "#0f172a" : "#f8fafc",
        minHeight: "100vh",
        color: isDark ? "#f8fafc" : "#111827",
        padding: "20px",
      }}
    >
      <div className="d-flex justify-content-end mb-3 gap-2">
        <Button variant={isDark ? "outline-light" : "outline-dark"} onClick={changeTheme}>
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </Button>
        <Button variant={isDark ? "outline-light" : "outline-dark"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
      {user ? (
        <>
          <Search userId={user.uid} />
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
    </div>
  );
}
export default Profile;