import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTodos } from "../../features/todo/todoSlice";
import { Search } from "../../todolist";
import { logoutUser, cleanForm } from "../../features/auth/authSlice";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { isLoading: todosLoading } = useSelector(state => state.todo);

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

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      dispatch(cleanForm());
      navigate("/login");
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-5">
        <p>User data not found.</p>
        <button className="btn btn-primary" onClick={handleLogout}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <>
          <Search userId={user.uid} />
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
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