import {Button, ButtonGroup} from "react-bootstrap";
import FadeIn from "react-fade-in";
import React from "react";
import { useHistory } from "react-router-dom";
// import "../styles/Home.css";

export default function Home() {
    let history = useHistory();
    return (
        <div className="Home">
            <FadeIn delay={1000}>
                <img className="Logo" src={require("../logo/cover.png")}/>
            </FadeIn>
        </div>
    );
}
