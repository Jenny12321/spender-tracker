import $ from 'jquery'
import React from "react";
import {Button, Table} from "react-bootstrap";
import FadeIn from "react-fade-in";
import "../styles/Entries.css";
import {EntryFormModal} from "../components/Modals";
import Cookies from "js-cookie";
import {EntryTable} from "../components/Tables";

export default class Entries extends React.Component {
    constructor(props) {
        super(props);

        const user = Cookies.get('user');
        console.log(user);
        if (!user || user === "undefined") {
            this.props.history.push("/");
        }

        this.state = {
            showForm: false,
            entries: JSON.parse(Cookies.get('entries'))
        };

        this.handleForm.bind(this);
        this.handleBack.bind(this);
        this.handleCloseForm.bind(this);
    }

    componentDidMount() {
        $.ajax({
            type: 'GET',
            url: "https://order-out-tracker.herokuapp.com/getExpenses?" +
                "user=" + Cookies.get('user'),
            data: '',
            dataType: 'json',
            success: function(response){
                const entries = response;
                Cookies.set('entries', entries);
            }
        });
    }

    addEntry(vendor, cost) {
        Cookies.set('spent', parseInt(Cookies.get('spent')) + cost);
        this.setState((state) => {
            let entries = state.entries;
            entries.push({'vendor': vendor, 'cost': cost});
            return {
                entries: entries,
                showForm: false
            }
        });
    }

    handleForm() {
        this.setState(() => {
            return {showForm: true};
        });
    }

    handleCloseForm() {
        this.setState(() => {
            return {showForm: false};
        });
    }

     handleBack() {
        this.props.history.goBack();
    }

    render () {
        return (
            <div className="Entries">
                <div className="HomeLogo">
                    <img className="Logo" src={require("../images/cover.png")}/>
                </div>
                <FadeIn delay={0}>
                    <div className="entries-content">
                        <Button className="entries-button"
                                size="sm"
                                variant="outline-primary"
                                onClick={this.handleBack.bind(this)}>
                            Back
                        </Button>
                        <Button className="right-align entries-button"
                                size="sm"
                                variant="success"
                                onClick={this.handleForm.bind(this)}>
                            Add
                        </Button>
                        <EntryFormModal
                            addEntry={this.addEntry.bind(this)}
                            show={this.state.showForm}
                            handleClose={this.handleCloseForm.bind(this)}
                        />
                        <EntryTable entries={this.state.entries}/>
                    </div>
                </FadeIn>
            </div>
        )
    }
}