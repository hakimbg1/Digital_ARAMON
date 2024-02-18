import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Offcanvas } from "react-bootstrap";
import { useAuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faQuestionCircle, faBars } from "@fortawesome/free-solid-svg-icons";
import { Routes, Route } from "react-router-dom";
import Home from "../../containers/Home/Home";
import StoredUrls from "../../containers/StoredUrls/StoredUrls";
import Login from "../../containers/Login/Login";
import Register from "../../containers/Register/Register";
import Profile from "../../containers/Profile/Profile";
import Support from "../../containers/Support/Support.jsx";
import "./Navbar.scss";

const NavBar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleToggle = () => setShowOffcanvas((prev) => !prev);

  return (
    <>
      <div className="nav-bar">
        {/* Navbar for Desktop */}
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand className="nav-heading">
              <NavLink to="/">Digital Sanofi ARAMON</NavLink>
            </Navbar.Brand>
            <Nav className="nav-links">
              <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/">
                Home
              </NavLink>

              {isLoggedIn && (
                <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/StoredUrls">
                  Storing Url
                </NavLink>
              )}

              {isLoggedIn && (
                <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/register">
                  Register
                </NavLink>
              )}

              {isLoggedIn && (
                <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/profile">
                  Profile
                </NavLink>
              )}
              {isLoggedIn && (
                <NavLink to="/" onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                }}>
                  <FontAwesomeIcon className="logout-icon" icon={faPowerOff} />
                </NavLink>
              )}
              {!isLoggedIn && (
                <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/login">
                  Login
                </NavLink>
              )}

              <Nav.Link className={({ isActive }) => (isActive ? "active" : "")} as={NavLink} to="/support">
                <FontAwesomeIcon icon={faQuestionCircle} className="support-icon" />
              </Nav.Link>
            </Nav>

            <div className="menu-menu">
            <Nav.Link className={({ isActive }) => (isActive ? "active" : "")} onClick={handleToggle}>
              <FontAwesomeIcon icon={faBars} className="menu-icon" />
            </Nav.Link>
            </div>
          </Container>
        </Navbar>

        {/* for Mobile */}
        <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end" backdropClassName="bg-dark">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="d-flex flex-column">
              <NavLink className="nav-link" to="/" onClick={handleClose}>
                Home
              </NavLink>

              {isLoggedIn && (
                <NavLink className="nav-link" to="/StoredUrls" onClick={handleClose}>
                  Storing Url
                </NavLink>
              )}

              {isLoggedIn && (
                <NavLink className="nav-link" to="/register" onClick={handleClose}>
                  Register
                </NavLink>
              )}

              {isLoggedIn && (
                <NavLink className="nav-link" to="/profile" onClick={handleClose}>
                  Profile
                </NavLink>
              )}
              {isLoggedIn && (
                <NavLink className="nav-link" to="/" onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  handleClose();
                }}>
                  <FontAwesomeIcon icon={faPowerOff} /> Logout
                </NavLink>
              )}
              {!isLoggedIn && (
                <NavLink className="nav-link" to="/login" onClick={handleClose}>
                  Login
                </NavLink>
              )}

              <NavLink className="nav-link" to="/support" onClick={handleClose}>
                <FontAwesomeIcon icon={faQuestionCircle} /> Support
              </NavLink>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        {isLoggedIn && <Route path="StoredUrls" element={<StoredUrls />} />}
        {isLoggedIn && <Route path="profile" element={<Profile />} />}
        {!isLoggedIn && <Route path="login" element={<Login />} />}
        {isLoggedIn && <Route path="register" element={<Register />} />}
        <Route path="support" element={<Support />} />
      </Routes>
    </>
  );
};

export default NavBar;