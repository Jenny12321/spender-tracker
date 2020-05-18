/* global $ */

import {Button, ButtonGroup, ProgressBar} from "react-bootstrap";
import FadeIn from "react-fade-in";
import React, {useContext, useState, Component} from "react";
import { useHistory } from "react-router-dom";
import "../styles/Home.css";
import Card from "react-bootstrap/Card";
import {ConfirmationModal, ProgressFormModal} from "../components/Modals";
import Cookies from "js-cookie";
import lifecycle from 'react-pure-lifecycle';
import {CardComponentCook, CardComponentOrder} from "../components/Cards";

const methods = {
    componentDidMount(props) {
        console.log('I mounted! Here are my props: ', props);
        $.ajax({
            type: 'GET',
            url: "https://order-out-tracker.herokuapp.com/progress?" +
                "user=" + Cookies.get('user'),
            data: '',
            dataType: 'json',
            success: function(response){
                const progressData = response;
                const percentOrder = progressData.percentOrder;
                const budget = progressData.budget;
                const spent = progressData.spent;
                const mealsCooked = progressData.cookCount;
                const mealsBought = progressData.orderCount;
                Cookies.set('percentOrder', percentOrder);
                Cookies.set('budget', budget);
                Cookies.set('spent', spent);
                Cookies.set('mealsCooked', mealsCooked);
                Cookies.set('mealsBought', mealsBought);
            }
        });
    }
};


function Home() {
    let history = useHistory();
    const user = Cookies.get('user');
    console.log(user);
    if (!user || user === "undefined") {
        history.push("/");
    }

    const[showReset, setShowReset] = useState(false);
    const handleCloseReset = () => setShowReset(false);
    const handleReset = () => setShowReset(true);

    const[progressCloseButton, setProgressCloseButton] = useState(!parseFloat(Cookies.get('percentOrder')) && !parseFloat(Cookies.get('budget')));
    const[showForm, setShowForm] = useState(!parseFloat(Cookies.get('percentOrder')) && !parseFloat(Cookies.get('budget')));
    const handleCloseForm = () => setShowForm(false);
    const handleForm = () => setShowForm(true);

    function handleLogOut(event) {
        Cookies.set('user', undefined);
        history.push("/");
    }

    function handleOpenEntries(event) {
        history.push('/entries');
    }

    const budget = parseInt(Cookies.get('budget'));
    const spent = parseInt(Cookies.get('spent'));
    const spentPercentage = spent/budget * 100;
    const budgetLeft = budget === 0 && spent === 0 ? 0 : budget == 0 ? 100 : 100-spentPercentage;
    const goal = parseInt(Cookies.get('percentOrder'));
    const mealsCooked = parseInt(Cookies.get('mealsCooked'));
    const mealsBought = parseInt(Cookies.get('mealsBought'));
    const actual = (mealsBought + mealsCooked) === 0 ? 0 : mealsCooked/(mealsBought + mealsCooked) * 100;

    function getProgressVariant() {
        const diff = actual - goal;
        switch (true) {
            case (diff > 25):
                return 'success';
            case (diff < 12):
                return 'danger';
            default:
                return 'warning';
        }
    }

    function handleResetProgress() {
        $.ajax({
            type: 'POST',
            url: "https://order-out-tracker.herokuapp.com/deleteProgress?" +
                "user=" + Cookies.get('user'),
            data: '',
            dataType: 'json',
            success: function(response){
                handleCloseReset();
            }
        });
    }

    /*function handleAddCooked() {
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
    }*/

    return (
        <div className="Home">
            <div className="HomeLogo">
                <img className="Logo" src={require("../images/cover.png")}/>
            </div>
            <FadeIn delay={0}>
                <div className="progress-content">
                    <div className="progress-group">

                        <ButtonGroup>
                            <Button className="right-align" size="sm" variant="outline-danger" onClick={handleReset}>Reset Progress</Button>
                            <Button className="right-align" size="sm" variant="outline-success" onClick={handleForm}>Change Goals</Button>
                        </ButtonGroup>
                        <ConfirmationModal
                            show={showReset}
                            handleConfirm={handleResetProgress}
                            handleClose={handleCloseReset}
                        />
                        <ProgressFormModal
                            closeButton={progressCloseButton}
                            show={showForm}
                            handleClose={handleCloseForm}
                        />
                        <div className="progress-cards">
                            <div className="progress-label">{budgetLeft}% of budget left</div>
                            <ProgressBar animated now={budgetLeft} label={`${budgetLeft}%`} variant='info'/>
                        </div>
                        <Card className="progress-cards">
                            <Card.Body>
                                <img className="card-icon" src={require("../images/business.png")}/>
                                <b>${spent}</b> of <b>${budget}</b> spent
                                <Button size="sm" variant="outline-info" onClick={handleOpenEntries}>Orders</Button>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="progress-group">
                        <div className="progress-cards">
                            <div className="progress-label"><b>Goal:</b> {goal}% cooked meals</div>
                            <ProgressBar animated now={goal} label={`${goal}%`}/>
                        </div>
                        <div className="progress-cards">
                            <div className="progress-label"><b>Currently:</b> {actual}% cooked meals</div>
                            <ProgressBar animated now={actual} label={`${actual}%`} variant={getProgressVariant()}/>
                        </div>
                        <CardComponentCook
                            image={require("../images/chef.png")}
                            buttonText={"+1"}
                            handlerType={"cook"}
                            cardCategory={<b>Meals <i>cooked:</i></b>}
                            cardStats={mealsCooked}
                        />
                        <CardComponentOrder
                            image={require("../images/junk-food.png")}
                            buttonText={"+1"}
                            handleClick={"order"}
                            cardCategory={<b>Meals <i>bought:</i></b>}
                            cardStats={mealsBought}
                        />
                    <Button className="right-align" size="sm" variant="outline-dark" onClick={handleLogOut}>Log Out</Button>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

export default lifecycle(methods)(Home);
