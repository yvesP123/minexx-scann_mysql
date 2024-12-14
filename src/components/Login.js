import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loadingToggleAction, loginAction } from './actions/AuthActions';

// Assume these are imported correctly
import logo from '../components/images/logo.png'
import bgImage from "../components/images/bg-login2.png";

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogin = (e) => {
    e.preventDefault();
    dispatch(loadingToggleAction(true));
    const from = location.state?.from 
      ? `${location.state.from.pathname}${location.state.from.search}` 
      : '/';
    dispatch(loginAction(email, password, from, navigate));
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        {/* Left column (background image) */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-between p-0" 
             style={{
               backgroundImage: `url(${bgImage})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
          <div className="p-4">
            <img src={logo} alt="Minexx" className="img-fluid mb-4" style={{maxWidth: '150px'}} />
            <h1 className="display-4 text-white font-weight-bold mb-3">Connecting Miners to the World</h1>
            <p className="lead text-white-50">Digital traceability and trading platform giving access to markets, capital and expertise.</p>
          </div>
          <div className="p-4">
            <div className="text-white-50 small">
              <Link to="/technology" className="text-white-50 mr-3">Technology</Link>
              <Link to="/contact" className="text-white-50 mr-3">Contact</Link>
              <span>&copy; 2023 Minexx</span>
            </div>
          </div>
        </div>

        {/* Right column (login form) */}
        <div className="col-12 col-md-6 bg-dark d-flex align-items-center justify-content-center p-4">
          <div className="w-100" style={{maxWidth: '400px'}}>
            <img src={logo} alt="Minexx" className="img-fluid mb-4 d-md-none" style={{maxWidth: '150px'}} />
            <h2 className="text-primary h2 mb-2">Welcome to Minexx</h2>
            <p className="text-muted mb-4">Sign in by entering information below</p>
            {props.errorMessage && (
              <div className="alert alert-danger" role="alert">
                {props.errorMessage}
              </div>
            )}
            {props.successMessage && (
              <div className="alert alert-success" role="alert">
                {props.successMessage}
              </div>
            )}
            <form onSubmit={onLogin}>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control bg-secondary text-white"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control bg-secondary text-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block w-100"
                disabled={props.showLoading}
              >
                {props.showLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage,
  showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(Login);