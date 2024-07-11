import VerificationProgress from "./VerificationProgress";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ permittedRoles, children }) {
    const { user } = useAuth();
    if (!user && localStorage.getItem('token')) {
        return <p>Loading...</p>;
    }

    if (!permittedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" />;
    }

    if (!user) {
        // If not logged in, allow access (for public routes)
        if (permittedRoles.includes(undefined)) {
          return children;
        }
        return <Navigate to="/unauthorized" />;
      }
      
    if (!user?.isVerified && user?.role==='doctor') {
        return  <VerificationProgress/>
    }

    if (!user) {
        return <Navigate to="/login" />;
    }
   
    return children;
}

