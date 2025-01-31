import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";
import React, {useState} from "react";
import lifecycle from 'react-pure-lifecycle';
import Cookies from "js-cookie";

const methods = {
    componentDidMount(props) {

    }
};

export const CardComponent = (props) => {
    return (
        <Card className="progress-cards">
            <Card.Body>
                <img className="card-icon" src={props.image}/>
                {props.cardCategory} {props.cardStats}
                <Button className="count-buttons" size="sm" variant="outline-danger" onClick={props.handleSubtract}>-1</Button>
                <Button className="count-buttons" size="sm" variant="outline-success" onClick={props.handleAdd}>+1</Button>
            </Card.Body>
        </Card>
    )
};
