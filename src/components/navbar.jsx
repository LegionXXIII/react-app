import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink to="" className="navbar-brand">
        Vidly
      </NavLink>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink to="/movies" className="nav-item nav-link">
            Movies
          </NavLink>
          <NavLink to="/customers" className="nav-item nav-link">
            Customers
          </NavLink>
          <NavLink to="rentals" className="nav-item nav-link">
            Rentals
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
