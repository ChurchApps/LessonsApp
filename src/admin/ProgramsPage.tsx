import React from "react";
import { Header, DisplayBox, Footer } from "./components"
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"


export const ProgramsPage = () => {
    return (<>
        <h1>Programs</h1>
        <DisplayBox headerText="Programs" headerIcon="none" >
            <table className="table">
                <thead><tr><th>Name</th></tr></thead>
                <tbody>
                    <tr><td><Link to="/admin/programs/1">High Voltage Elementary</Link></td></tr>
                </tbody>
            </table>
        </DisplayBox>
    </>);
}
