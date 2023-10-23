import React from "react"
import "../App.css"
import "../CSS/homepage.css"
import Header from "../components/header"
import TicTacToe from "../images/TicTacToe.png"
import Checkers from "../images/checker-board.png"
import ConnectFour from "../images/ConnectFour.jpg"

export default function Homepage() {
    return (
        <div id="root">
            <head>
            </head>
            <Header />
            <body>
                <div id="bodyContainer">
                    <div id="listContainer">
                        
                        <div class="gameContainer">
                            <div class="game">
                                <a href='/TicTacToe'>
                                    <img class="gameImage" src={TicTacToe} alt="Tic-Tac-Toe"></img>
                                </a>
                                <div class="gameImage-outline"></div>
                            </div>
                            <div class="gameName">
                                Tic-Tac-Toe
                            </div>
                        </div>

                        <div class="gameContainer">
                            <div class="game">
                                <a href="/checkers">
                                    <img class="gameImage" src={Checkers} alt="Checkers"></img>
                                </a>
                                <div class="gameImage-outline"></div>
                            </div>
                            <div class="gameName">
                                Checkers
                            </div>
                        </div>

                        <div class="gameContainer">
                            <div class="game">
                                <a href="/connect-four">
                                    <img class="gameImage" src={ConnectFour} alt="Connect Four"></img>
                                </a>
                                <div class="gameImage-outline"></div>
                            </div>
                            <div class="gameName">
                                Connect Four
                            </div>
                        </div>
        
                    </div>
                </div>
            </body>
        </div>
    )
}