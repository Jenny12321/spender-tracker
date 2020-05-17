import {Button, ButtonGroup} from "react-bootstrap";
import FadeIn from "react-fade-in";
import React from "react";
import { useHistory } from "react-router-dom";
import "../styles/Landing.css";

export default function Landing() {
    let history = useHistory();
    return (
        <div className="Landing">
            <FadeIn delay={1000}>
                <img className="Logo" src={require("../images/cover.png")}/>
                <ButtonGroup>
                    <Button onClick={() => history.push('/login')} className="buttons" variant="primary" type="button" >
                        Login
                    </Button>
                    <Button onClick={() => history.push('/register')} className="buttons" variant="primary" type="button">
                        Register
                    </Button>
                </ButtonGroup>
            </FadeIn>
        </div>
    );
}
