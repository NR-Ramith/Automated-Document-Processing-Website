import React from "react";
import { Navbar, Nav } from 'react-bootstrap';
import './Header.css';
import logo from "../images/Scanner.png";

const Header = () => {
    return (
        <Navbar class="container-fluid" bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">
                <img class="pl-10"
                    src={logo}
                    alt="Logo"
                    width="30"
                    height="30"
                />
                Application Scanner
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="#about">About</Nav.Link>
                    <Nav.Link href="#services">Services</Nav.Link>
                    <Nav.Link href="#contact">Contact</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;