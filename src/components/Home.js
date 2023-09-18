import React from "react";
import './Home.css';
import bgimg from "../images/Scanner.png";
import { Button } from "react-bootstrap";
import About from "./About";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home">
            <img
                src={bgimg}
                alt="Logo"
            />
            <h1 class="mt-2 text-center">The best solution for all your scanning needs!</h1>
            <div class="d-flex justify-content-center mt-3">
                <Link to="/formsList">
                    <Button class="btn-primary">Start Scanning</Button>
                </Link>
            </div>
            <About />
        </div>
    );
};

export default Home;
