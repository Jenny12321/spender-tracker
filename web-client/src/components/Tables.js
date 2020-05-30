import {Table} from "react-bootstrap";
import React from "react";


export function renderTableRows(entry, index) {
    console.log(entry.cost);
    // debugger;
    return (
        <tr>
            <td>{index+1}</td>
            <td>{entry.vendor}</td>
            <td>${parseInt(entry.cost).toFixed(2)}</td>
        </tr>
    );
}

export function renderTableBody(entries) {
    const rows = entries;
    return (
        <tbody>
        {rows.length !== 0 && rows.map((entry, index) => {
            return renderTableRows(entry, index)
        })}
        </tbody>
    );
}

export const EntryTable = (props) => {
    return (
        <Table striped hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Restaurant</th>
                <th>Cost</th>
            </tr>
            </thead>
            {renderTableBody(props.entries)}
        </Table>
    )
};
