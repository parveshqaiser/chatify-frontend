

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
   
    const isAuth = localStorage.getItem('token');
    // console.log("_________________ ", isAuth);
    
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
