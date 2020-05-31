import $ from 'jquery'
import React, {useState} from "react";
import {Alert, Button, Form, FormGroup} from "react-bootstrap";
import "../styles/Login.css";
import {withRouter} from 'react-router-dom';
import FadeIn from "react-fade-in";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";


export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    let history = useHistory();

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        $.ajax({
            type: 'POST',
            url: "https://order-out-tracker.herokuapp.com/createAccount?" +
                "username=" + username +
                "&password=" + password,
            data: '',
            dataType: 'json',
            success: function(response){
                let k=response;
                if (k.success) {
                    Cookies.set('user', username);
                    history.push('/home');
                    setLoading(false);
                    setValidated(true);
                    setError("");
                } else {
                    console.log(k.message);
                    setError(k.message);
                    setValidated(false);
                }
            }
        });
    }

    return (
        <FadeIn>
            <div className="RegisterForm">
                <form>
                    <Form>
                        <FormGroup controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                type="username"
                                placeholder="Enter username" />
                        </FormGroup>

                        <FormGroup controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password" />
                        </FormGroup>
                        <Button variant="primary"
                                type="submit"
                                disabled={isLoading}
                                onClick={!isLoading ? handleSubmit : null}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                        <Alert className="UserAlert" variant="danger" show={!validated}>{error}</Alert>
                    </Form>
                </form>
            </div>
        </FadeIn>
    );
}
