import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // Check the Redux Brain to see if the user is logged in
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If they are NOT logged in, instantly bounce them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they ARE logged in, render whatever component was passed inside (the children)
  return children;
};

export default ProtectedRoute;