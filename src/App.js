import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Link, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';
import Account from './components/Account';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import DoctorProfile from './components/DoctorProfile';
import CreateAvailability from './components/CreateAvailabilities';
import Unauthorized from './components/UnAuthorized';
import PageNotFound from './components/PageNotFound';
import AllVerifiedDoctors from './components/AllVerifiedDoctors';
import AllDoctors from './components/adminDashboard/AllDoctors';
import AllPatients from './components/adminDashboard/AllPatients';
import ResetPassword from './components/ResetPassword';
import { Navbar, Nav, NavItem, NavLink, Collapse, NavbarToggler } from 'reactstrap';

function App() {
  const { user, handleLogin, handleLogout } = useAuth();
  const email = useSelector((state) => state.forgot.email);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        try {
          const response = await axios.get('http://localhost:5555/api/users/account', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          handleLogin(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      })();
    }

    // Event listeners for disabling right-click, copy, cut, paste
    // const disableRightClick = (e) => {
    //   e.preventDefault();
    // };
    // const disableCopyCutPaste = (e) => {
    //   e.preventDefault();
    // };
    // document.addEventListener('contextmenu', disableRightClick);
    // document.addEventListener('copy', disableCopyCutPaste);
    // document.addEventListener('cut', disableCopyCutPaste);
    // document.addEventListener('paste', disableCopyCutPaste);

    // // Cleanup event listener on component unmount
    // return () => {
    //   document.removeEventListener('contextmenu', disableRightClick);
    //   document.removeEventListener('copy', disableCopyCutPaste);
    //   document.removeEventListener('cut', disableCopyCutPaste);
    //   document.removeEventListener('paste', disableCopyCutPaste);
    // };
  }, []);

  return (
    <>
      <Helmet>
        <title>Book My Doc</title>
        <link rel="icon" type="image/png" href="%PUBLIC_URL%/life-line.ico" sizes="16x16" />
      </Helmet>
      
      <Navbar color="primary" light expand="md">
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">Home</NavLink>
            </NavItem>
            {!user ? (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/login">Login</NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/account">Account</NavLink>
                </NavItem>
                {user.role === 'admin' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} to="/profile">Profile</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/all-doctors">See Doctors</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/all-patients">See Patients</NavLink>
                    </NavItem>
                  </>
                )}
                {user.role === 'patient' && (
                  <NavItem>
                    <NavLink tag={Link} to="/profile">Profile</NavLink>
                  </NavItem>
                )}
                {user.role === 'doctor' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} to="/doctor-profile">Profile</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/create-availability">Create Availability</NavLink>
                    </NavItem>
                  </>
                )}
              </>
            )}
           {!user || ((user && user.role !== 'admin') && (user.role !== 'doctor')) ? (
              <NavItem>
                <NavLink tag={Link} to="/all-verified-doctors">Book Doctors</NavLink>
              </NavItem>
            ) : null}
            {user && (
              <NavItem>
                <NavLink
                  tag={Link}
                  to="/"
                  onClick={() => {
                    localStorage.removeItem('token');
                    handleLogout();
                  }}
                >
                  Logout
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
      
      <div className='container'>
        <Routes>
          <Route path='/all-verified-doctors' element={<PrivateRoute permittedRoles={[undefined, 'patient']}><AllVerifiedDoctors /></PrivateRoute>} />
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/account' element={<Account />} />
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='/all-doctors' element={<PrivateRoute permittedRoles={['admin']}><AllDoctors /></PrivateRoute>} />
          <Route path='/all-patients' element={<PrivateRoute permittedRoles={['admin']}><AllPatients /></PrivateRoute>} />
          <Route path='/profile' element={<PrivateRoute permittedRoles={['admin', 'patient']}><Profile /></PrivateRoute>} />
          <Route path='/doctor-profile' element={<PrivateRoute permittedRoles={['doctor']}><DoctorProfile /></PrivateRoute>} />
          <Route path='/create-availability' element={<PrivateRoute permittedRoles={['doctor']}><CreateAvailability /></PrivateRoute>} />
          <Route path='*' element={<PageNotFound />} />
          {email.length > 0 && <Route path='/reset-password' element={<ResetPassword />} />}
        </Routes>
      </div>
    </>
  );
}

export default App;
