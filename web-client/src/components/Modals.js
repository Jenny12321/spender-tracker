import React from "react";
import {Button, Modal} from "react-bootstrap";
import {EntryForm, ProgressForm} from "./Forms";
import Cookies from "js-cookie";

export const ConfirmationModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Wait!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to reset your progress? This will wipe out all existing information.</Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={props.handleConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export const ProgressFormModal = (props) => {
    const handleClose = props.disableClose ? () => {} : props.handleClose;
    return (
        <Modal show={props.show} onHide={handleClose} animation={false}>
            <Modal.Header {...props.closeButton}>
                <Modal.Title>Change Goals</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ProgressForm changePercent={props.changePercent}
                              changeBudget={props.changeBudget}
                              handleCloseForm={props.handleClose}/>
            </Modal.Body>
            {/*<Modal.Footer>
                <Button disabled={!props.closeButton} variant="outline-secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleSubmitProgress}>
                    Done!
                </Button>
            </Modal.Footer>*/}
        </Modal>
    )
};

export const EntryFormModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>I Ordered Out!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EntryForm addEntry={props.addEntry}/>
            </Modal.Body>
            {/*<Modal.Footer>
                <Button variant="outline-secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleSubmitForm}>
                    Add
                </Button>
            </Modal.Footer>*/}
        </Modal>
    )
};
