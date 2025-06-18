import React, { memo, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";



const AdminProtectedRoute = memo(({ children }) => {
    const { checkAdmin, loading, isAdmin, adminChecked } = useAuthStore();
    
    useEffect(() => {
        if (!adminChecked)
            checkAdmin();
    }, [checkAdmin, adminChecked]);

    console.log("AdminProtectedRoute", isAdmin, loading, adminChecked);

    const { pathname } = useLocation();

    if (!adminChecked || loading) return <LoadingSpinner />;
    if (!isAdmin && pathname !== "/login") {
        return <Navigate to="/" state={{ from: pathname }} replace />;
    }
    return children;
});

export default AdminProtectedRoute