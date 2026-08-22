

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
   
    const isAuth = localStorage.getItem('token');
    console.log("_________________ ", isAuth);
    
    if (!isAuth) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace />;
    }
    
    // If authenticated, render the child components
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
