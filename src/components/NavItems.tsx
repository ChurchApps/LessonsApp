import React from "react";
import { UserHelper, Permissions } from "./";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Props {
    prefix?: String;
}

export const NavItems: React.FC<Props> = (props) => {
    const location = useLocation();
    const getSelected = (): string => {
        let url = location.pathname;
        let result = "Lessons";
        if (url.indexOf("/profile") > -1) result = "Profile";
        return result;
    };

    const getClass = (sectionName: string): string => {
        if (sectionName === getSelected()) return "nav-link active";
        else return "nav-link";
    };

    const getTab = (key: string, url: string, icon: string, label: string) => (
        <li key={key} className="nav-item" data-toggle={props.prefix === "main" ? null : "collapse"} data-target={props.prefix === "main" ? null : "#userMenu"} id={(props.prefix || "") + key + "Tab"}>
            <Link className={getClass(key)} to={url}>
                <i className={icon}></i> {label}
            </Link>
        </li>
    );

    const getTabs = () => {
        let tabs = [];
        tabs.push(getTab("Lessons", "/lessons", "fas fa-user", "Lessons"));
        tabs.push(getTab("Profile", "/profile", "fas fa-user", "Profile"));
        return tabs;
    };

    return <>{getTabs()}</>;
};
