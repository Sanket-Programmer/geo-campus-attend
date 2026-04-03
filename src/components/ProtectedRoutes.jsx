import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // if not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // if wrong role
  if (
    allowedRole &&
    user.role.toLowerCase() !== allowedRole.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;