import {Button, ButtonGroup, ProgressBar} from "react-bootstrap";
import FadeIn from "react-fade-in";
import React from "react";
import "../styles/Home.css";
import Card from "react-bootstrap/Card";
import {ConfirmationModal, ProgressFormModal} from "../components/Modals";
import Cookies from "js-cookie";
import {CardComponent} from "../components/Cards";
import $ from 'jquery'

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        const user = Cookies.get('user');
        console.log(user);
        if (!user || user === "undefined") {
            this.props.history.push("/");
        }
        const percent = 0;//parseFloat(Cookies.get('percentOrder'));
        const budget = 0;//parseFloat(Cookies.get('budget'));
        this.state = {
            showReset : false,
            showForm: !percent && !budget,
            progressCloseButton: !percent && !budget,
            percent: percent,
            budget: budget,
            spent: 0,// parseFloat(Cookies.get('spent')),
            mealsCooked: 0,//Cookies.get('mealsCooked'),
            mealsBought: 0,//Cookies.get('mealsBought')
        };

        this.handleReset = this.handleReset.bind(this);
        this.handleCloseReset = this.handleCloseReset.bind(this);
        this.handleForm = this.handleForm.bind(this);
        this.handleCloseForm = this.handleCloseForm.bind(this);
        this.handleOpenEntries = this.handleOpenEntries.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleAddCooked = this.handleAddCooked.bind(this);
        this.handleAddTakeout = this.handleAddTakeout.bind(this);
        this.handleResetProgress = this.handleResetProgress.bind(this);
    }

    componentWillMount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
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
        }).done(() => {
            const percent = parseFloat(Cookies.get('percentOrder'));
            const budget = parseFloat(Cookies.get('budget'));
            this.setState(() => {
                return {
                    showReset : false,
                    showForm: !percent && !budget,
                    progressCloseButton: !percent && !budget,
                    percent: percent,
                    budget: budget,
                    spent: parseFloat(Cookies.get('spent')),
                    mealsCooked: Cookies.get('mealsCooked'),
                    mealsBought: Cookies.get('mealsBought')
                };
            });
        })
    }

    changePercent(value) {
        this.setState(() => {
            return {percent: parseInt(value)};
        });
    }

    changeBudget(value) {
        this.setState(() => {
            return {budget: parseInt(value)};
        });
    }

    clearAllCookies() {
        Object.keys(Cookies.get()).forEach(function(cookieName) {
            Cookies.remove(cookieName);
        });
    }

    handleLogOut(event) {
        Cookies.set('user', undefined);
        this.props.history.push("/");
        this.clearAllCookies();
    }

    handleOpenEntries(event) {
        Cookies.set('percentOrder', this.state.percent);
        Cookies.set('budget', this.state.budget);
        Cookies.set('spent', this.state.spent);
        Cookies.set('mealsCooked', this.state.mealsCooked);
        Cookies.set('mealsBought', this.state.mealsBought);
        this.props.history.push('/entries');
    }

    getProgressVariant(actual, goal) {
        const diff = actual - goal;
        switch (true) {
            case (diff >= 0):
                return 'success';
            case (diff > 12):
                return 'warning';
            default:
                return 'danger';
        }
    }

     handleResetProgress() {
        $.ajax({
            type: 'POST',
            url: "https://order-out-tracker.herokuapp.com/deleteProgress?" +
                "user=" + Cookies.get('user'),
            data: '',
            dataType: 'json',
            success: function (response) {
            }
        });
        this.setState(() => {
            return {budget: 0,
                percent: 0,
                spent: 0,
                mealsCooked: 0,
                mealsOrdered: 0,
                showReset: false,
                showForm: true};
        });
    }

     handleAddCooked() {
        let mealsCooked = parseInt(this.state.mealsCooked);
        $.ajax({
            type: 'POST',
            url: "https://order-out-tracker.herokuapp.com/addCookCount?" +
                "user=" + Cookies.get('user') +
                "&count=1",
            data: '',
            dataType: 'json',
            success: function () {
                const newCooked = mealsCooked + 1;
                Cookies.set('mealsCooked', newCooked);
            }
        });
        this.setState((state) => {
            return {mealsCooked: parseInt(state.mealsCooked) + 1};
        });
    }

     handleAddTakeout() {
         let mealsBought = parseInt(this.state.mealsBought);
         $.ajax({
            type: 'POST',
            url: "https://order-out-tracker.herokuapp.com/addOrderCount?" +
                "user=" + Cookies.get('user') +
                "&count=1",
            data: '',
            dataType: 'json',
            success: function () {
                const newBought = mealsBought + 1;
                Cookies.set('mealsBought', newBought);
            }
        });
         this.setState((state) => {
             return {mealsBought: parseInt(state.mealsBought) + 1};
         });
    }

    handleReset() {
        this.setState(() => {
            return {showReset: true}
        });
    }

    handleForm() {
        this.setState(() => {
            return {showForm: true}
        });
    }

    handleCloseReset() {
        this.setState(() => {
            return {showReset: false};
        });
    }

    handleCloseForm() {
        this.setState(() => {
            return {showForm: false};
        });
    }

    render() {
        const budget = parseInt(this.state.budget);
        const spent = parseInt(this.state.spent);
        const spentPercentage = spent / budget * 100;
        let budgetLeft = budget === 0 && spent === 0 ? 0 : budget === 0 ? 100 : 100 - spentPercentage;
        budgetLeft = budgetLeft.toFixed(0);
        const goal = parseInt(this.state.percent);
        const mealsCooked = parseInt(this.state.mealsCooked);
        const mealsBought = parseInt(this.state.mealsBought);
        let actual = (mealsBought + mealsCooked) === 0 ? 0 : mealsCooked / (mealsBought + mealsCooked) * 100;
        actual = actual.toFixed(0);
        return (
            <div className="Home">
                <div className="HomeLogo">
                    <img className="Logo" src={require("../images/cover.png")}/>
                </div>
                <FadeIn delay={0}>
                    <div className="progress-content">
                        <div className="progress-group">

                            <ButtonGroup>
                                <Button className="right-align" size="sm" variant="outline-danger"
                                        onClick={this.handleReset}>Reset Progress</Button>
                                <Button className="right-align" size="sm" variant="outline-success"
                                        onClick={this.handleForm}>Change Goals</Button>
                            </ButtonGroup>
                            <ConfirmationModal
                                show={this.state.showReset}
                                handleConfirm={this.handleResetProgress.bind(this)}
                                handleClose={this.handleCloseReset}
                            />
                            <ProgressFormModal
                                closeButton={this.state.progressCloseButton}
                                show={this.state.showForm}
                                changePercent={this.changePercent.bind(this)}
                                changeBudget={this.changeBudget.bind(this)}
                                disableClose={(!this.state.percent && !this.state.budget)}
                                handleClose={this.handleCloseForm.bind(this)}
                            />
                            <div className="progress-cards">
                                <div className="progress-label">{budgetLeft}% of budget left</div>
                                <ProgressBar animated now={budgetLeft} label={`${budgetLeft}%`} variant='info'/>
                            </div>
                            <Card className="progress-cards">
                                <Card.Body>
                                    <img className="card-icon" src={require("../images/business.png")}/>
                                    <b>${spent}</b> of <b>${budget}</b> spent
                                    <Button size="sm" variant="outline-info" onClick={this.handleOpenEntries}>Orders</Button>
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
                                <ProgressBar animated now={actual}
                                             label={`${actual}%`}
                                             variant={this.getProgressVariant(actual, goal)}/>
                            </div>
                            <CardComponent
                                image={require("../images/chef.png")}
                                buttonText={"+1"}
                                handleAdd={(this.state.budget || this.state.percent)&&this.handleAddCooked}
                                cardCategory={<b>Meals <i>cooked:</i></b>}
                                cardStats={mealsCooked}
                            />
                            <CardComponent
                                image={require("../images/junk-food.png")}
                                buttonText={"+1"}
                                handleAdd={(this.state.budget || this.state.percent)&&this.handleAddTakeout}
                                cardCategory={<b>Meals <i>bought:</i></b>}
                                cardStats={mealsBought}
                            />
                            <Button className="right-align" size="sm" variant="outline-dark" onClick={this.handleLogOut}>Log
                                Out</Button>
                        </div>
                    </div>
                </FadeIn>
            </div>
        );
    }
}
