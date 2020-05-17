import React, {useState} from "react";
import {Button, Table} from "react-bootstrap";
import FadeIn from "react-fade-in";
import "../styles/Entries.css";
import {BrowserRouter} from "react-router-dom";
import { useHistory } from "react-router-dom";
import {ConfirmationModal, EntryFormModal, ProgressFormModal} from "../components/Modals";
import Cookies from "js-cookie";

export default function Entries() {
    let history = useHistory();
    if (!Cookies.get('user')) {
        history.push("/");
    }
    const user = Cookies.get('user');

    const[showForm, setShowForm] = useState(false);
    const handleCloseForm = () => setShowForm(false);
    const handleForm = () => setShowForm(true);

    function handleBack() {
        history.goBack();
    }

    return (
        <div className="Entries">
            <div className="HomeLogo">
                <img className="Logo" src={require("../images/cover.png")}/>
            </div>
            <FadeIn delay={700}>
                <div className="entries-content">
                    <Button className="entries-button"
                            size="sm"
                            variant="outline-primary"
                            onClick={handleBack}>
                        Back
                    </Button>
                    <Button className="right-align entries-button"
                            size="sm"
                            variant="success"
                            onClick={handleForm}>
                        Add
                    </Button>
                    <EntryFormModal
                        show={showForm}
                        handleClose={handleCloseForm}
                    />

                    <Table striped hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </FadeIn>
        </div>
    )
}