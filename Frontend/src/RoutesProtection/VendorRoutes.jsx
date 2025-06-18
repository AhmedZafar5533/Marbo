import React, { memo, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";




const VendorProtectedRoute = memo(({ children }) => {
    const checkVendor = useAuthStore((s) => s.checkVendor);
    const vendorChecked = useAuthStore((s) => s.vendorChecked);
    const isVendor = useAuthStore((s) => s.isVendor);
    const loading = useAuthStore((s) => s.loading);


    const { pathname } = useLocation();

    useEffect(() => {
        if (!vendorChecked) {
            checkVendor();
        }
    }, [checkVendor, vendorChecked]);

    console.log("VendorProtectedRoute", isVendor, loading, vendorChecked);

    if (!vendorChecked || loading) return <LoadingSpinner />;

    if (!isVendor && pathname !== "/login") {
        return <Navigate to="/" state={{ from: pathname }} replace />;
    }

    return children;
});


export default VendorProtectedRoute