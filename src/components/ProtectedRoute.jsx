import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  let navigate = useNavigate();
  let { User } = useContext(AppContext);

  if (!User.email) {
    return navigate("/");
  }

  return children;
};

export default ProtectedRoute;
