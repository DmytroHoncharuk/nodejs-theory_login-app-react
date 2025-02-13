import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, NavLink } from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.css';
import './styles.scss';

import { useAuth } from './components/AuthContext';
import { usePageError } from './hooks/usePageError';
import { Loader } from './components/Loader';
import { HomePage } from './pages/HomePage';
import { RegistrationPage } from './pages/auth/RegistrationPage.tsx';
import { AccountActivationPage } from './pages/auth/AccountActivationPage.tsx';
import { LoginPage } from './pages/auth/LoginPage.tsx';
import { RequireAuth } from './components/RequireAuth';
import { AxiosError } from 'axios';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.tsx';
import { ResetPasswordPage } from './pages/auth/ResetPassword.tsx';
import { ProfilePage } from './pages/profile/ProfilePage.tsx';
import { ProfileLayout } from './pages/profile/ProfileLayout.tsx';
import { ChangeEmailPage } from './pages/profile/ChangeEmailPage.tsx';
import { ChangePasswordPage } from './pages/profile/ChangePasswordPage.tsx';

export function App() {
  const navigate = useNavigate();
  const [error, setError] = usePageError('');
  const { isChecked, currentUser, logout, checkAuth } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkAuth();
  }, []);

  if (!isChecked) {
    return <Loader />;
  }

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/');
      })
      .catch((error: AxiosError<{ message?: string }>) => {
        setError(error.response?.data?.message ?? '');
      });
  };

  return (
    <>
      <nav
        className="navbar has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-start">
          <NavLink to="/" className="navbar-item">
            Home
          </NavLink>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {currentUser ? (
                <div className="dropdown is-right is-hoverable is-rounded">
                  <div className="dropdown-trigger">
                    <button
                      className="button is-light has-text-weight-bold"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                      onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                      <span className="icon">
                        <i className="fas fa-user"></i>
                      </span>
                    </button>
                  </div>
                  {isDropdownOpen && (
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                      <div className="dropdown-content">
                        <Link to="/profile" className="dropdown-item">
                          My Profile
                        </Link>
                        <hr className="dropdown-divider" />
                        <button className="dropdown-item" onClick={handleLogout}>
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/sign-up"
                    className="button is-light has-text-weight-bold"
                  >
                    Sign up
                  </Link>

                  <Link
                    to="/login"
                    className="button is-success has-text-weight-bold"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="section">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="sign-up" element={<RegistrationPage />} />
            <Route
              path="activate/:email/:activationToken"
              element={<AccountActivationPage />}
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="reset-password/:token" element={<ResetPasswordPage/>}/>
            <Route path="/profile" element={<ProfileLayout/>}>
              <Route index element={<ProfilePage />} />
              <Route path="email" element={<ChangeEmailPage />} />
              <Route path="password" element={<ChangePasswordPage />} />
            </Route>

            <Route path="/" element={<RequireAuth />}>
            </Route>
          </Routes>
        </section>

        {error && <p className="notification is-danger is-light">{error}</p>}
      </main>
    </>
  );
}
