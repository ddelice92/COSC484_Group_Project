import React from "react";
import "../CSS/header.css"

export default function Header() {
    return (
        <div>
            <head>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </head>
            <header>
            <a id="user" href='/login'>
                <i class="material-icons">person_outline</i>
            </a>
            </header>
        </div>
    )
}