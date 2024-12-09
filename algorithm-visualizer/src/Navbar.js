import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.css";
import Button from "react-bootstrap/Button";
import HomePage from "./pages/HomePage";
import { Link } from "react-router-dom"

export default function App() { 
  //        position: "fixed", top: 0, left: 0,
  return (
    <div
      style={{
        width: "100%",
        zIndex: 1050, // Ensures it stays above most elements
      }}
    >
      <Navbar style={{ float: "top" }} expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Algorithm Visualizer</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="grids">GRIDS</Link>
            </Nav>
            <Nav className="me-auto">
              <Link to="graphs">GRAPHS</Link>
            </Nav>
            <Nav className="me-auto">
              <Link to="trees">TREES</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>{" "}
    </div>
  );
}
