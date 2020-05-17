import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";
import React from "react";

export const CardComponent = (props) => {
    return (
        <Card className="progress-cards">
            <Card.Body>
                <img className="card-icon" src={props.image}/>
                {props.cardCategory} {props.cardStats}
                <Button size="sm" variant="outline-primary" onClick={props.handleClick}>{props.buttonText}</Button>
            </Card.Body>
        </Card>
    )
};