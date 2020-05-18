/* global $ */
import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";
import React, {useState} from "react";
import lifecycle from 'react-pure-lifecycle';
import Cookies from "js-cookie";

const methods = {
    componentDidMount(props) {

    }
};

function handleAddCooked() {
    $.ajax({
        type: 'POST',
        url: "https://order-out-tracker.herokuapp.com/addCookCount?" +
            "user=" + Cookies.get('user') +
            "&count=1",
        data: '',
        dataType: 'json',
        success: function(response){
            const newCooked = parseInt(Cookies.get('mealsCooked')) + 1;
            Cookies.set('mealsCooked', newCooked);
        }
    });
}

function handleAddTakeout() {
    $.ajax({
        type: 'POST',
        url: "https://order-out-tracker.herokuapp.com/addOrderCount?" +
            "user=" + Cookies.get('user') +
            "&count=1",
        data: '',
        dataType: 'json',
        success: function(response) {
            const newCooked = parseInt(Cookies.get('mealsBought')) + 1;
            Cookies.set('mealsBought', newCooked);
        }
    });
}

export const CardComponentCook = (props) => {
    return (
        <Card className="progress-cards">
            <Card.Body>
                <img className="card-icon" src={props.image}/>
                {props.cardCategory} {props.cardStats}
                <Button size="sm" variant="outline-primary" onClick={handleAddCooked}>{props.buttonText}</Button>
            </Card.Body>
        </Card>
    )
};

export const CardComponentOrder = (props) => {
    return (
        <Card className="progress-cards">
            <Card.Body>
                <img className="card-icon" src={props.image}/>
                {props.cardCategory} {props.cardStats}
                <Button size="sm" variant="outline-primary" onClick={handleAddCooked}>{props.buttonText}</Button>
            </Card.Body>
        </Card>
    )
};
