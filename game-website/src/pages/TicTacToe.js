import React, { useEffect, useState, useRef } from "react"
import Header from "../components/header"
import useWebSocket from 'react-use-websocket';
import AuthUser from '../components/authUser'
import s from "../CSS/tictactoe.module.css"


export default function TicTacToe() {
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://localhost:8080', {
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 1,
        reconnectAttempts: 5
    });
    const [gameName, setGameName] = useState('');
    const [gameData, setGameData] = useState([]);//The current board for the game
    const [selectedBoxes, setSelectedBoxes] = useState([]);
    const [move, setMove] = useState('');

    const canvasRef = useRef(null);


    useEffect(() => {

        if (lastJsonMessage !== null) {//Whenever a json message is received, refresh gameData 
            setGameData(lastJsonMessage.currentBoard);
            console.log(gameData);
        } else {
            setGameData(["e", "e", "e", "e", "e", "e", "e", "e", "e",]);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        console.log(selectedBoxes)
    },[selectedBoxes])

    useEffect(() => {
        if (gameData != null) {
            drawBoard();
        }
    },[gameData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = {
            type: 'getGame',
            message: gameName
        }
        sendJsonMessage(message);//Sends a json message to the node server to request data for gameName


    }

    const handleMove = (e) => {
        e.preventDefault();
        const message = {
            type: 'makeMove',
            message: [selectedBoxes, move],
            gameName: gameName
        }
        console.log(message);
        sendJsonMessage(message);

    }

    const drawBoard = () => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        //Draws the board lines
        context.beginPath();
        context.moveTo(0, 100);
        context.lineTo(300, 100);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 200);
        context.lineTo(300, 200);
        context.stroke();


        context.beginPath();
        context.moveTo(100, 0);
        context.lineTo(100, 300);
        context.stroke();

        context.beginPath();
        context.moveTo(200, 0);
        context.lineTo(200, 300);
        context.stroke();

        for (let i = 0; i < 9; i = i+3) {
            for (let j = 0; j < 3; j++) {//Draws x
                if (gameData[i + j] === 'x') {
                    console.log('drawing x at ' + (i+j))
                    context.beginPath();
                    context.moveTo(j * 100 + 20, i/3 * 100 + 20);
                    context.lineTo(j * 100 + 80, i/3 * 100 + 80);
                    context.stroke();
        
                    context.beginPath();
                    context.moveTo(j * 100 + 80, i/3 * 100 + 20);
                    context.lineTo(j * 100 + 20, i/3 * 100 + 80);
                    context.stroke();
                } else if (gameData[i+j] === 'o') {//draws o
                    context.beginPath();
                    context.arc(j * 100 + 50, i/3 * 100 + 50, 40, 0, 2 * Math.PI);
                    context.stroke();
                }
            }
        }
    }



    const handleClick = (event) => {//Prints the current location of the mouse relative to the canvas when the canvas is clicked
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const x = Math.trunc(event.clientX - canvasRect.left);
        const y = Math.trunc(event.clientY - canvasRect.top);

        const cell = Math.trunc(x / 100) + (Math.trunc(y / 100) * 3);
        setSelectedBoxes(cell);
        console.log(cell);

        console.log(`${x} + ${y}`);
    };


    return (
        <div>
            <AuthUser />
            <Header />
            <div className={s.container}>
                <form className={s.gameForm} onSubmit={handleSubmit}>
                    <label for="text">Game name</label>
                    <input value={gameName} onChange={(e) => setGameName(e.target.value)} type="text" id="gamename" name="gamename"></input>
                    <button type="submit" id="button">Get game data</button>
                </form>
                <form className={s.gameForm} onSubmit={handleMove}>
                    <label for="text">Move {selectedBoxes}</label>
                    <input value={move} onChange={(e) => setMove(e.target.value)} type="text" id="movename" name="movename"></input>
                    <button type="submit" id="button">Submit move</button>
                </form>
                <div className={s.canvasContainer}>
                    <canvas ref={canvasRef} onClick={handleClick} id="tic-tac-toe-canvas" width="300" height="300">
                    </canvas>
                </div>
            </div>
        </div>
    )
}