import React from "react";
import './Home.css';
import { Link } from "react-router-dom";

const Menu = () => {
    return (
        <div className="menu">
            <p>Do not have the filled application form?</p>
            <Link to="/chatBot">
                <button>Try ChatBot</button>
            </Link>
        </div>
    );
};

export default Menu;
