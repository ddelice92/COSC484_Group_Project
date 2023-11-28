import React from "react"
import Header from "../components/header"
import Checkerboard from "../components/checkerboard.js"
import AuthUser from '../components/authUser'
import s from "../CSS/checkers.module.css"

export default function Checkers() {
    return (
        <div>
            <AuthUser />
            <Header />
            <div id={s.container}>
                <div id={s.canvasContainer}>
                    <Checkerboard />
                </div>
            </div>
        </div>
    )
}