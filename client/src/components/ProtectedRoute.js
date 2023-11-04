import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to='/login' />;
    }

    return <Outlet />
}

export default ProtectedRoute;