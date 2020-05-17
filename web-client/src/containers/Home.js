/* global $ */

import {Button, ButtonGroup, ProgressBar} from "react-bootstrap";
import FadeIn from "react-fade-in";
import React, {useContext, useState, Component} from "react";
import { useHistory } from "react-router-dom";
import "../styles/Home.css";
import {CardComponent} from "../components/Cards";
import Card from "react-bootstrap/Card";
import {ConfirmationModal, ProgressFormModal} from "../components/Modals";
import Cookies from "js-cookie";
import lifecycle from 'react-pure-lifecycle';

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
    if (!Cookies.get('user')) {
        history.push("/");
    }

    const user = Cookies.get('user');

    const[showReset, setShowReset] = useState(false);
    const handleCloseReset = () => setShowReset(false);
    const handleReset = () => setShowReset(true);

    const[progressCloseButton, setProgressCloseButton] = useState(true);
    const[showForm, setShowForm] = useState(false);
    const handleCloseForm = () => setShowForm(false);
    const handleForm = () => setShowForm(true);

    if (!Cookies.get('percentOrder') && !Cookies.get('budget')) {
        setProgressCloseButton(false);
        setShowForm(true);
    }

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
    const budgetLeft = spentPercentage ? 100 : 100-spentPercentage;
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

    return (
        <div className="Home">
            <FadeIn delay={700}>
                <div className="HomeLogo">
                    <img className="Logo" src={require("../images/cover.png")}/>
                </div>

                <div className="progress-content">
                    <div className="progress-group">
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
                        <CardComponent
                            image={require("../images/chef.png")}
                            buttonText={"+1"}
                            handleClick={handleAddCooked}
                            cardCategory={<b>Meals <i>cooked:</i></b>}
                            cardStats={mealsCooked}
                        />
                        <CardComponent
                            image={require("../images/junk-food.png")}
                            buttonText={"+1"}
                            handleClick={handleAddTakeout}
                            cardCategory={<b>Meals <i>bought:</i></b>}
                            cardStats={mealsBought}
                        />
                    </div>
                    <Button className="right-align" size="sm" variant="outline-dark" onClick={handleLogOut}>Log Out</Button>
                    <Button className="right-align" size="sm" variant="outline-danger" onClick={handleReset}>Reset Progress</Button>
                    <Button className="right-align" size="sm" variant="outline-warning" onClick={handleForm}>Change Goals</Button>
                    <ConfirmationModal
                        show={showReset}
                        handleClose={handleCloseReset}
                    />
                    <ProgressFormModal
                        closeButton={progressCloseButton}
                        show={showForm}
                        handleClose={handleCloseForm}
                    />
                </div>
            </FadeIn>
        </div>
    );
}

export default lifecycle(methods)(Home);
