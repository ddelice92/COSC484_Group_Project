import React from "react";
import { useAuth } from '../context/user.context';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import "../CSS/header.css"

export default function Header() {
    const { token } = useAuth();
    
    if (!token) {
        return (
            <div>
                <head>
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                </head>
                <header>
                <a id="home" href='/homepage'>
                    <HomeOutlinedIcon id="homeIcon"></HomeOutlinedIcon>
                </a>
                <a id="user" href='/login'>
                    <i class="material-icons">person_outline</i>
                </a>
                </header>
            </div>
        )
    }
    else{
        return (
            <div>
                <head>
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                </head>
                <header>
                <a id="home" href='/homepage'>
                    <HomeOutlinedIcon id="homeIcon"></HomeOutlinedIcon>
                </a>
                <a id="user" href='/user'>
                    <i class="material-icons">person_outline</i>
                </a>
                </header>
            </div>
        )
    }
}