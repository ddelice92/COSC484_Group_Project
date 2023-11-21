import React from "react"
import Header from "../components/header"
import Checkerboard from "../components/checkerboard.js"
import s from "../CSS/checkers.module.css"

export default function Checkers() {
    return (
        <div>
            <Header />
            <div id={s.container}>
                <div id={s.canvasContainer}>
                    <Checkerboard />
                </div>
            </div>
        </div>
    )
}