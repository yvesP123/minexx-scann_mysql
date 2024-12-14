import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './components/Login';
import ExportPage from './components/Exportpage';

// ProtectedRoute component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate 
      to="/login" 
      state={{ from: location }}
      replace 
    />;
  }

  return children;
};

const App = ({ isAuthenticated }) => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/export/:id/:company_id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ExportPage />
            </ProtectedRoute>
          }
        />
        {/* Handle the QR code URL */}
        <Route
          path="/export/:id/:company_id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ExportPage />
            </ProtectedRoute>
          }
        />
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.auth.idToken !== null // Adjust according to your auth state structure
});

export default connect(mapStateToProps)(App);