import React from "react";
import { DisplayBox } from "./"
import { Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"


export const ProgramPage = () => {
    const [mode, setMode] = React.useState("display");
    const handleEdit = () => setMode("edit");

    return (<>
        <h2>Studies</h2>

        <DisplayBox headerText="Studies" headerIcon="none" editFunction={handleEdit}>
            <table className="table">
                <thead><tr><th>Name</th></tr></thead>
                <tbody>
                    <tr><td><Link to="/admin/programs/1">High Voltage Elementary</Link></td></tr>
                </tbody>
            </table>
        </DisplayBox>

    </>);
}
