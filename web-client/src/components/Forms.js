/* global $ */
import React from "react";
import {Button, Form} from "react-bootstrap";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";

let progressPercent = 0;
let progressBudget = 0;

// let history = useHistory();

export function handleSubmitProgress(event, changePercent, changeBudget, closeForm) {
    event.preventDefault();
    const user = Cookies.get('user');
    Cookies.set('progressPercent', progressPercent.value);
    Cookies.set('progressBudget', progressBudget.value);
    $.ajax({
        type: 'POST',
        url: "https://order-out-tracker.herokuapp.com/setProgress?" +
            "user=" + user +
            "&percentOrder=" + progressPercent.value +
            "&budget=" + progressBudget.value,
        data: '',
        success: function(response){
            changePercent(progressPercent.value);
            changeBudget(progressBudget.value);
            closeForm();
        }
    });
}

export const ProgressForm = (props) => {
    return (
        // eslint-disable-next-line no-restricted-globals
        <Form onSubmit={() => handleSubmitProgress(event, props.changePercent, props.changeBudget, props.handleCloseForm)}>
            <Form.Group controlId="formGridPercent">
                <Form.Label>Percentage of cooked meals (%)</Form.Label>
                <Form.Control type="number" placeholder="50" ref={(input) => progressPercent = input}/>
            </Form.Group>

            <Form.Group controlId="formGridBudget">
                <Form.Label>Budget ($)</Form.Label>
                <Form.Control type="number" placeholder="150" ref={(input) => progressBudget = input}/>
            </Form.Group>
            <Button type="submit" variant="success">
                Done!
            </Button>
        </Form>
    )
};

export const EntryForm = (props) => {
    return (
        <Form>
            <Form.Group controlId="formGridVendor">
                <Form.Label>Restaurant:</Form.Label>
                <Form.Control type="text" placeholder="McDonald's" />
            </Form.Group>

            <Form.Group controlId="formGridCost">
                <Form.Label>Cost ($)</Form.Label>
                <Form.Control type="number" placeholder="$12.00" />
            </Form.Group>
        </Form>
    )
};
